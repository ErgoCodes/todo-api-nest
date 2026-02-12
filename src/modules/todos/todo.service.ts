import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TODO_REPOSITORY } from 'src/lib/utils';
import type { ITodoRepository } from 'src/lib/interfaces';

@Injectable()
export class TodoService {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: ITodoRepository,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string) {
    return await this.todoRepository.create(createTodoDto, userId);
  }

  async findAll(userId: string) {
    return await this.todoRepository.findByUserId(userId);
  }

  async findOne(id: string, userId: string) {
    const todo = await this.todoRepository.findById(id, userId);
    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string) {
    return await this.todoRepository.update(id, updateTodoDto, userId);
  }

  async remove(id: string, userId: string) {
    return await this.todoRepository.delete(id, userId);
  }
}
