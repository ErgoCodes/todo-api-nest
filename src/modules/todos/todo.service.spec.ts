import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TODO_REPOSITORY } from 'src/lib/utils';
import { NotFoundException } from '@nestjs/common';

const mockTodoRepository = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: TODO_REPOSITORY, useValue: mockTodoRepository },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const dto = { title: 'Test', description: 'Desc' };
      const userId = 'user1';
      const expected = { id: '1', ...dto, userId };

      mockTodoRepository.create.mockResolvedValue(expected);

      const result = await service.create(dto, userId);
      expect(mockTodoRepository.create).toHaveBeenCalledWith(dto, userId);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos = [{ id: '1', title: 'Test' }];
      mockTodoRepository.findByUserId.mockResolvedValue(todos);

      const result = await service.findAll('user1');
      expect(result).toEqual(todos);
    });
  });

  describe('findOne', () => {
    it('should return a todo if found', async () => {
      const todo = { id: '1', title: 'Test' };
      mockTodoRepository.findById.mockResolvedValue(todo);

      const result = await service.findOne('1', 'user1');
      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException if not found', async () => {
      mockTodoRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const dto = { title: 'Updated' };
      const expected = { id: '1', title: 'Updated' };
      mockTodoRepository.update.mockResolvedValue(expected);

      const result = await service.update('1', dto, 'user1');
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      mockTodoRepository.delete.mockResolvedValue({ id: '1' });
      await service.remove('1', 'user1');
      expect(mockTodoRepository.delete).toHaveBeenCalledWith('1', 'user1');
    });
  });
});
