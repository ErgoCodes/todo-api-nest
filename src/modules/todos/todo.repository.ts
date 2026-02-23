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
    const response = await this.prisma.todo.findMany({ where: { userId } });
    return response;
  }
  async create(item: CreateTodoDto, userId: string): Promise<Todo> {
    const { completed, tags, ...rest } = item;
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
  }
  async update(id: string, item: UpdateTodoDto, userId: string): Promise<Todo> {
    const response = await this.prisma.todo.update({
      where: { id, userId },
      data: item,
    });
    return response;
  }
  async delete(id: string, userId: string): Promise<Todo> {
    const response = await this.prisma.todo.delete({ where: { id, userId } });
    return response;
  }
  async findAll(): Promise<Todo[]> {
    const response = await this.prisma.todo.findMany();
    return response;
  }
  async findById(id: string, userId: string): Promise<Todo | null> {
    const response = await this.prisma.todo.findUnique({
      where: { id, userId },
    });
    return response;
  }
}
