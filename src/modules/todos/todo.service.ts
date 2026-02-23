import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TODO_REPOSITORY } from 'src/lib/utils';
import type { ITodoRepository } from 'src/lib/interfaces';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';

const CACHE_TTL = 60; // seconds

@Injectable()
export class TodoService {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: ITodoRepository,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private userTodosKey(userId: string): string {
    return `todos:user:${userId}`;
  }

  private todoKey(id: string, userId: string): string {
    return `todos:item:${userId}:${id}`;
  }

  async create(createTodoDto: CreateTodoDto, userId: string) {
    const todo = await this.todoRepository.create(createTodoDto, userId);
    // Invalidate the user's todo list cache
    await this.redis.del(this.userTodosKey(userId));
    return todo;
  }

  async findAll(userId: string) {
    const cacheKey = this.userTodosKey(userId);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const todos = await this.todoRepository.findByUserId(userId);
    await this.redis.set(cacheKey, JSON.stringify(todos), 'EX', CACHE_TTL);
    return todos;
  }

  async findOne(id: string, userId: string) {
    const cacheKey = this.todoKey(id, userId);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const todo = await this.todoRepository.findById(id, userId);
    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }

    await this.redis.set(cacheKey, JSON.stringify(todo), 'EX', CACHE_TTL);
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string) {
    const todo = await this.todoRepository.update(id, updateTodoDto, userId);
    // Invalidate both the specific todo and the user's list
    await this.redis.del(this.todoKey(id, userId), this.userTodosKey(userId));
    return todo;
  }

  async remove(id: string, userId: string) {
    const todo = await this.todoRepository.delete(id, userId);
    // Invalidate both the specific todo and the user's list
    await this.redis.del(this.todoKey(id, userId), this.userTodosKey(userId));
    return todo;
  }
}
