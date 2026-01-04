import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TodoController],
  imports:[PrismaModule],
  providers: [TodoService],
})
export class TodoModule {}
