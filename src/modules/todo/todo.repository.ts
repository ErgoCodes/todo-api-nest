import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Injectable } from '@nestjs/common';
import { Todo } from 'generated/prisma/browser';
import { ITodoRepository } from 'src/lib/interfaces';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(private readonly prisma: PrismaService) {}
  findByUserId(userId: string): Promise<Todo[]> {
    return this.prisma.todo.findMany({ where: { userId } });
  }
  create(item: CreateTodoDto) {
    const { completed, tags, ...rest } = item;
    return this.prisma.todo.create({
      data: {
        ...rest,
        completed: completed ?? false,
        tags: tags ?? [],
      },
    });
  }
  update(id: string, item: UpdateTodoDto) {
    return this.prisma.todo.update({ where: { id }, data: item });
  }
  delete(id: string) {
    return this.prisma.todo.delete({ where: { id } });
  }
  findAll() {
    return this.prisma.todo.findMany();
  }
  findById(id: string) {
    return this.prisma.todo.findUnique({ where: { id } });
  }
}
