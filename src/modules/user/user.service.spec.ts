import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER_REPOSITORY } from 'src/lib/utils';
import { NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

// Mock repository
const mockUserRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUsername: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const dto = {
        username: 'test',
        password: 'plain',
        email: 'test@test.com',
      };
      const expected = { id: '1', ...dto, password: 'hashed' };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed');
      mockUserRepository.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(argon2.hash).toHaveBeenCalledWith('plain');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...dto,
        password: 'hashed',
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return users', async () => {
      const users = [{ id: '1', username: 'test' }];
      mockUserRepository.findAll.mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return user if found', async () => {
      const user = { id: '1', username: 'test' };
      mockUserRepository.findById.mockResolvedValue(user);
      expect(await service.findOne('1')).toEqual(user);
    });

    it('should throw NotFoundException if not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash password if provided in update', async () => {
      const dto = { password: 'newpass' };
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_new');
      mockUserRepository.update.mockResolvedValue({ id: '1' });

      await service.update('1', dto);

      expect(argon2.hash).toHaveBeenCalledWith('newpass');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        password: 'hashed_new',
      });
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      mockUserRepository.delete.mockResolvedValue({ id: '1' });
      await service.remove('1');
      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
