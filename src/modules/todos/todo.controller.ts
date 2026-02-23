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
} from '@nestjs/common';
import { User } from '../../lib/decorators/user.decorator';
import type { RequestUser } from '../../lib/interfaces/request-user.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { AuthGuard } from '../auth/guards/auth-guard';

@ApiTags('todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
    type: Todo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateTodoDto })
  create(@Body() createTodoDto: CreateTodoDto, @User() user: RequestUser) {
    return this.todoService.create(createTodoDto, user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'Return all todos.', type: [Todo] })
  findAll(@User() user: RequestUser) {
    return this.todoService.findAll(user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiResponse({ status: 200, description: 'Return the todo.', type: Todo })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  findOne(@Param('id') id: string, @User() user: RequestUser) {
    return this.todoService.findOne(id, user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully updated.',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @ApiBody({ type: UpdateTodoDto })
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: RequestUser,
  ) {
    return this.todoService.update(id, updateTodoDto, user.userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Todo })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully deleted.',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  remove(@Param('id') id: string, @User() user: RequestUser) {
    return this.todoService.remove(id, user.userId);
  }
}
