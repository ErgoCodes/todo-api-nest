import { Inject, Injectable } from '@nestjs/common';
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
