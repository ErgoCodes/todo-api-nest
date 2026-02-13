import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { RequestUser } from '../../lib/interfaces/request-user.interface';
import { AuthGuard } from '../auth/guards/auth-guard';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;

  const mockTodoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: RequestUser = { userId: 'user1', username: 'testuser' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Desc',
      };
      const result = { id: '1', ...createTodoDto, userId: mockUser.userId };
      mockTodoService.create.mockResolvedValue(result);

      expect(await controller.create(createTodoDto, mockUser)).toEqual(result);
      expect(mockTodoService.create).toHaveBeenCalledWith(
        createTodoDto,
        mockUser.userId,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = [{ id: '1', title: 'Test Todo', userId: mockUser.userId }];
      mockTodoService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(mockUser)).toEqual(result);
      expect(mockTodoService.findAll).toHaveBeenCalledWith(mockUser.userId);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = { id: '1', title: 'Test Todo', userId: mockUser.userId };
      mockTodoService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1', mockUser)).toEqual(result);
      expect(mockTodoService.findOne).toHaveBeenCalledWith(
        '1',
        mockUser.userId,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
      const result = {
        id: '1',
        title: 'Updated Todo',
        userId: mockUser.userId,
      };
      mockTodoService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateTodoDto, mockUser)).toEqual(
        result,
      );
      expect(mockTodoService.update).toHaveBeenCalledWith(
        '1',
        updateTodoDto,
        mockUser.userId,
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const result = {
        id: '1',
        title: 'Deleted Todo',
        userId: mockUser.userId,
      };
      mockTodoService.remove.mockResolvedValue(result);

      expect(await controller.remove('1', mockUser)).toEqual(result);
      expect(mockTodoService.remove).toHaveBeenCalledWith('1', mockUser.userId);
    });
  });
});
