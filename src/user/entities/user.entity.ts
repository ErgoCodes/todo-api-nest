import { Exclude } from "class-transformer";
import { IsDate, IsObject, IsString, IsUUID } from "class-validator";

export class User {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  @Exclude()
  password: string;

  @IsObject()
  todos: any[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
