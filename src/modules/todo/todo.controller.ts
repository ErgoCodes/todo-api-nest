import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  SerializeOptions,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
