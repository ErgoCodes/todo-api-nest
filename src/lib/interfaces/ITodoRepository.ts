import { Todo } from 'generated/prisma/browser';
import { CreateTodoDto } from 'src/modules/todos/dto/create-todo.dto';
import { UpdateTodoDto } from 'src/modules/todos/dto/update-todo.dto';
import { IRepository } from './IRepository';

export interface ITodoRepository extends IRepository<
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
  [string]
> {
  create(item: CreateTodoDto, userId: string): Promise<Todo>;
  update(id: string, item: UpdateTodoDto, userId: string): Promise<Todo>;
  delete(id: string, userId: string): Promise<Todo>;
  findAll(): Promise<Todo[]>;
  findById(id: string, userId: string): Promise<Todo | null>;
  findByUserId(userId: string): Promise<Todo[]>;
}
