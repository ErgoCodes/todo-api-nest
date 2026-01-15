import { Todo } from "generated/prisma/browser";
import { CreateTodoDto } from "src/modules/todo/dto/create-todo.dto";
import { UpdateTodoDto } from "src/modules/todo/dto/update-todo.dto";
import { IRepository } from "./IRepository";

export interface ITodoRepository extends IRepository<Todo, CreateTodoDto, UpdateTodoDto> {
    findByUserId(userId: string): Promise<Todo[]>;
}