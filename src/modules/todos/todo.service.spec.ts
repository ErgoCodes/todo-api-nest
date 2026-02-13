import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TODO_REPOSITORY } from '../../lib/utils';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;
  let repositoryMock: any;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: TODO_REPOSITORY,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };
      const userId = 'user-1';
      const expectedTodo = { id: 'todo-1', ...createTodoDto, userId };

      repositoryMock.create.mockResolvedValue(expectedTodo);

      const result = await service.create(createTodoDto, userId);

      expect(repositoryMock.create).toHaveBeenCalledWith(createTodoDto, userId);
      expect(result).toEqual(expectedTodo);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos for a user', async () => {
      const userId = 'user-1';
      const todos = [{ id: 'todo-1', title: 'Test Todo', userId }];

      repositoryMock.findByUserId.mockResolvedValue(todos);

      const result = await service.findAll(userId);

      expect(repositoryMock.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(todos);
    });
  });

  describe('findOne', () => {
    it('should return a todo if found', async () => {
      const id = 'todo-1';
      const userId = 'user-1';
      const todo = { id, title: 'Test Todo', userId };

      repositoryMock.findById.mockResolvedValue(todo);

      const result = await service.findOne(id, userId);

      expect(repositoryMock.findById).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      const id = 'todo-1';
      const userId = 'user-1';

      repositoryMock.findById.mockResolvedValue(null);

      await expect(service.findOne(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const id = 'todo-1';
      const userId = 'user-1';
      const updateTodoDto = { title: 'Updated Todo' };
      const updatedTodo = { id, ...updateTodoDto, userId };

      repositoryMock.update.mockResolvedValue(updatedTodo);

      const result = await service.update(id, updateTodoDto, userId);

      expect(repositoryMock.update).toHaveBeenCalledWith(
        id,
        updateTodoDto,
        userId,
      );
      expect(result).toEqual(updatedTodo);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const id = 'todo-1';
      const userId = 'user-1';
      const deletedTodo = { id, title: 'Test Todo', userId };

      repositoryMock.delete.mockResolvedValue(deletedTodo);

      const result = await service.remove(id, userId);

      expect(repositoryMock.delete).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual(deletedTodo);
    });
  });
});
