import { PrismaService } from 'src/prisma/prisma.service';
import { IRepository } from 'src/lib/interfaces';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Injectable } from '@nestjs/common';
import { Todo } from 'generated/prisma/browser';

@Injectable()
export class TodoRepository implements IRepository<Todo,CreateTodoDto,UpdateTodoDto> {
  constructor(private readonly prisma: PrismaService) {}
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
