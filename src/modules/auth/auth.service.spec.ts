import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

// Mock dependencies
const mockUserService = {
  findByUsername: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        username: 'test',
        email: 'test@test.com',
        password: 'pass',
      };
      const createdUser = { id: '1', ...registerDto, password: 'hashed_pass' };

      mockUserService.findByUsername.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(createdUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.register(registerDto);

      expect(mockUserService.findByUsername).toHaveBeenCalledWith('test');
      expect(mockUserService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        accessToken: 'token',
        userId: '1',
        username: 'test',
      });
    });

    it('should throw ConflictException if username exists', async () => {
      mockUserService.findByUsername.mockResolvedValue({ id: '1' });

      await expect(
        service.register({ username: 'test', email: 't@t.com', password: 'p' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('validate', () => {
    it('should return user info if validation succeeds', async () => {
      const user = { id: '1', username: 'test', password: 'hashed_pass' };
      mockUserService.findByUsername.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validate({
        username: 'test',
        password: 'pass',
      });
      expect(result).toEqual({ username: 'test', userId: '1' });
    });

    it('should return null if user not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);
      const result = await service.validate({
        username: 'test',
        password: 'pass',
      });
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = { id: '1', username: 'test', password: 'hashed_pass' };
      mockUserService.findByUsername.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.validate({
        username: 'test',
        password: 'wrong',
      });
      expect(result).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should return access token', async () => {
      mockJwtService.signAsync.mockResolvedValue('token');
      const result = await service.signIn({ userId: '1', username: 'test' });
      expect(result).toEqual({
        accessToken: 'token',
        userId: '1',
        username: 'test',
      });
    });
  });
});
