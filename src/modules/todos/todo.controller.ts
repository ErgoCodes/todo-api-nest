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
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { AuthGuard } from '../auth/guards/auth-guard';

@Controller('todos')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    return this.todoService.create(createTodoDto, req.user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Get()
  findAll(@Req() req: any) {
    return this.todoService.findAll(req.user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.todoService.findOne(id, req.user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any,
  ) {
    return this.todoService.update(id, updateTodoDto, req.user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.todoService.remove(id, req.user.userId);
  }
}
