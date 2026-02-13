import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    userServiceMock = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    };
    jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should return strict user info if password matches', async () => {
      const authDto = { username: 'test', password: 'password' };
      const user = {
        id: '1',
        username: 'test',
        password: 'hashedPassword',
        userId: '1',
      };

      userServiceMock.findByUsername.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validate(authDto);

      expect(userServiceMock.findByUsername).toHaveBeenCalledWith('test');
      expect(argon2.verify).toHaveBeenCalledWith('hashedPassword', 'password');
      expect(result).toEqual({ username: 'test', userId: '1' });
    });

    it('should return null if user not found', async () => {
      const authDto = { username: 'test', password: 'password' };
      userServiceMock.findByUsername.mockResolvedValue(null);

      const result = await service.validate(authDto);

      expect(userServiceMock.findByUsername).toHaveBeenCalledWith('test');
      expect(argon2.verify).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const authDto = { username: 'test', password: 'wrongPassword' };
      const user = { id: '1', username: 'test', password: 'hashedPassword' };

      userServiceMock.findByUsername.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.validate(authDto);

      expect(argon2.verify).toHaveBeenCalledWith(
        'hashedPassword',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should return access token if validation passes', async () => {
      const authDto = { username: 'test', password: 'password' };
      const user = { username: 'test', userId: '1' };
      const accessToken = 'token';

      jest.spyOn(service, 'validate').mockResolvedValue(user);
      jwtServiceMock.signAsync.mockResolvedValue(accessToken);

      const result = await service.authenticate(authDto);

      expect(service.validate).toHaveBeenCalledWith(authDto);
      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
      expect(result).toEqual({ accessToken, userId: '1', username: 'test' });
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      const authDto = { username: 'test', password: 'wrongPassword' };
      jest.spyOn(service, 'validate').mockResolvedValue(null);

      await expect(service.authenticate(authDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should create new user and return token if username available', async () => {
      const registerDto = {
        username: 'test',
        password: 'password',
        email: 'test@test.com',
      };
      const newUser = { id: '1', ...registerDto };
      const accessToken = 'token';

      userServiceMock.findByUsername.mockResolvedValue(null);
      userServiceMock.create.mockResolvedValue(newUser);
      jwtServiceMock.signAsync.mockResolvedValue(accessToken);

      const result = await service.register(registerDto);

      expect(userServiceMock.findByUsername).toHaveBeenCalledWith('test');
      expect(userServiceMock.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({ accessToken, userId: '1', username: 'test' });
    });

    it('should throw ConflictException if username already exists', async () => {
      const registerDto = {
        username: 'test',
        password: 'password',
        email: 'test@test.com',
      };
      userServiceMock.findByUsername.mockResolvedValue({
        id: '1',
        username: 'test',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
