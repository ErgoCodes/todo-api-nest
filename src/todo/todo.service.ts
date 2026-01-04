import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    return await this.prisma.todo.create({data:{
      title:createTodoDto.title,
      description:createTodoDto.description,
      completed:createTodoDto.completed ?? false,
      tags:createTodoDto.tags,
      userId:createTodoDto.userId,
    }});
  }

  async findAll() {
    return await this.prisma.todo.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.todo.findUnique({where:{
      id
    }});
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    return await this.prisma.todo.update({where:{
      id
    },data:updateTodoDto});
  }

  async remove(id: string) {
    return await this.prisma.todo.delete({where:{
      id
    }});
  }
}
