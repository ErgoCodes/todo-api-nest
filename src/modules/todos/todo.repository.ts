import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Injectable } from '@nestjs/common';
import { Todo } from 'generated/prisma/browser';
import { ITodoRepository } from 'src/lib/interfaces';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByUserId(userId: string): Promise<Todo[]> {
    try {
      const response = await this.prisma.todo.findMany({ where: { userId } });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to find todo by user id');
    }
  }
  async create(item: CreateTodoDto, userId: string): Promise<Todo> {
    const { completed, tags, ...rest } = item;
    try {
      const response = await this.prisma.todo.create({
        data: {
          ...rest,
          completed: completed ?? false,
          tags: tags ?? [],
        user: {
          connect: { id: userId },
        },
      },
    });
    return response;
    } catch (error) {
      throw new Error('Database error: Unable to create todo');
    }
  }
  async update(id: string, item: UpdateTodoDto, userId: string): Promise<Todo> {
    try {
      const response = await this.prisma.todo.update({ where: { id, userId }, data: item });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to update todo');
    }
  }
  async delete(id: string, userId: string): Promise<Todo> {
    try {
      const response = await this.prisma.todo.delete({ where: { id, userId } });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to delete todo');
    }
  }
  async findAll(): Promise<Todo[]> {
    try {
      const response = await this.prisma.todo.findMany();
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to find all todos');
    }
  }
  async findById(id: string, userId: string): Promise<Todo | null> {
    try {
      const response = await this.prisma.todo.findUnique({ where: { id, userId } });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to find todo by id');
    }
  }
}
