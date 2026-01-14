import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from 'generated/prisma/browser';
import * as interfaces from 'src/lib/interfaces';
import { TODO_REPOSITORY } from 'src/lib/utils';

@Injectable()
export class TodoService {
  constructor(
    @Inject(TODO_REPOSITORY) 
    private readonly todoRepository: interfaces.IRepository<Todo, CreateTodoDto, UpdateTodoDto>,
  ) {}



  async create(createTodoDto: CreateTodoDto) {
    return await this.todoRepository.create(createTodoDto);
  }

  async findAll() {
    return await this.todoRepository.findAll();
  }

  async findOne(id: string) {
    return await this.todoRepository.findById(id);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    return await this.todoRepository.update(id,updateTodoDto);
  }

  async remove(id: string) {
    return await this.todoRepository.delete(id);
  }
}
