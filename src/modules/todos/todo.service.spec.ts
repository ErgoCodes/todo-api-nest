import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TODO_REPOSITORY } from 'src/lib/utils';
import { REDIS_CLIENT } from '../redis/redis.module';
import { NotFoundException } from '@nestjs/common';

const mockTodoRepository = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: TODO_REPOSITORY, useValue: mockTodoRepository },
        { provide: REDIS_CLIENT, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo and invalidate cache', async () => {
      const dto = { title: 'Test', description: 'Desc' };
      const userId = 'user1';
      const expected = { id: '1', ...dto, userId };

      mockTodoRepository.create.mockResolvedValue(expected);
      mockRedis.del.mockResolvedValue(1);

      const result = await service.create(dto, userId);
      expect(mockTodoRepository.create).toHaveBeenCalledWith(dto, userId);
      expect(mockRedis.del).toHaveBeenCalledWith('todos:user:user1');
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return cached todos if available', async () => {
      const todos = [{ id: '1', title: 'Test' }];
      mockRedis.get.mockResolvedValue(JSON.stringify(todos));

      const result = await service.findAll('user1');
      expect(mockRedis.get).toHaveBeenCalledWith('todos:user:user1');
      expect(mockTodoRepository.findByUserId).not.toHaveBeenCalled();
      expect(result).toEqual(todos);
    });

    it('should fetch from DB and cache if no cache exists', async () => {
      const todos = [{ id: '1', title: 'Test' }];
      mockRedis.get.mockResolvedValue(null);
      mockTodoRepository.findByUserId.mockResolvedValue(todos);
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.findAll('user1');
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith('user1');
      expect(mockRedis.set).toHaveBeenCalledWith(
        'todos:user:user1',
        JSON.stringify(todos),
        'EX',
        60,
      );
      expect(result).toEqual(todos);
    });
  });

  describe('findOne', () => {
    it('should return cached todo if available', async () => {
      const todo = { id: '1', title: 'Test' };
      mockRedis.get.mockResolvedValue(JSON.stringify(todo));

      const result = await service.findOne('1', 'user1');
      expect(mockRedis.get).toHaveBeenCalledWith('todos:item:user1:1');
      expect(mockTodoRepository.findById).not.toHaveBeenCalled();
      expect(result).toEqual(todo);
    });

    it('should fetch from DB and cache if no cache exists', async () => {
      const todo = { id: '1', title: 'Test' };
      mockRedis.get.mockResolvedValue(null);
      mockTodoRepository.findById.mockResolvedValue(todo);
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.findOne('1', 'user1');
      expect(mockTodoRepository.findById).toHaveBeenCalledWith('1', 'user1');
      expect(mockRedis.set).toHaveBeenCalledWith(
        'todos:item:user1:1',
        JSON.stringify(todo),
        'EX',
        60,
      );
      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockTodoRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo and invalidate cache', async () => {
      const dto = { title: 'Updated' };
      const expected = { id: '1', title: 'Updated' };
      mockTodoRepository.update.mockResolvedValue(expected);
      mockRedis.del.mockResolvedValue(2);

      const result = await service.update('1', dto, 'user1');
      expect(result).toEqual(expected);
      expect(mockRedis.del).toHaveBeenCalledWith(
        'todos:item:user1:1',
        'todos:user:user1',
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo and invalidate cache', async () => {
      mockTodoRepository.delete.mockResolvedValue({ id: '1' });
      mockRedis.del.mockResolvedValue(2);

      await service.remove('1', 'user1');
      expect(mockTodoRepository.delete).toHaveBeenCalledWith('1', 'user1');
      expect(mockRedis.del).toHaveBeenCalledWith(
        'todos:item:user1:1',
        'todos:user:user1',
      );
    });
  });
});
