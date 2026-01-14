import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { TodoController } from './todo.controller';
import { TODO_REPOSITORY } from 'src/lib/utils';


@Module({
  controllers: [TodoController],
  providers: [
    TodoService,
    TodoRepository,
    { provide: TODO_REPOSITORY, useClass: TodoRepository },
  ],
})
export class TodoModule {}
