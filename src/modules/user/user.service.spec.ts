import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER_REPOSITORY } from '../../lib/utils';
import { NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: any;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const createUserDto = {
        username: 'test',
        password: 'password',
        email: 'test@test.com',
      };
      const hashedPassword = 'hashedPassword';
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      repositoryMock.create.mockResolvedValue({
        ...createUserDto,
        password: hashedPassword,
        id: '1',
      });

      const result = await service.create(createUserDto);

      expect(argon2.hash).toHaveBeenCalledWith('password');
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(result).toEqual({
        ...createUserDto,
        password: hashedPassword,
        id: '1',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', username: 'test' }];
      repositoryMock.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repositoryMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', username: 'test' };
      repositoryMock.findById.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(repositoryMock.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repositoryMock.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash password if provided and update user', async () => {
      const updateUserDto = { password: 'newPassword' };
      const hashedPassword = 'hashedNewPassword';
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      repositoryMock.update.mockResolvedValue({
        id: '1',
        ...updateUserDto,
        password: hashedPassword,
      });

      const result = await service.update('1', updateUserDto);

      expect(argon2.hash).toHaveBeenCalledWith('newPassword');
      expect(repositoryMock.update).toHaveBeenCalledWith('1', {
        ...updateUserDto,
        password: hashedPassword,
      });
      expect(result).toEqual({
        id: '1',
        ...updateUserDto,
        password: hashedPassword,
      });
    });

    it('should update user without hashing if password not provided', async () => {
      const updateUserDto = { username: 'newUsername' };
      repositoryMock.update.mockResolvedValue({ id: '1', ...updateUserDto });

      const result = await service.update('1', updateUserDto);

      expect(argon2.hash).not.toHaveBeenCalled();
      expect(repositoryMock.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual({ id: '1', ...updateUserDto });
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      repositoryMock.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(repositoryMock.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      const user = { id: '1', username: 'test' };
      repositoryMock.findByUsername.mockResolvedValue(user);

      const result = await service.findByUsername('test');

      expect(repositoryMock.findByUsername).toHaveBeenCalledWith('test');
      expect(result).toEqual(user);
    });
  });
});
