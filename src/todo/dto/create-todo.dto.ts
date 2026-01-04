import { IsString, IsBoolean, IsOptional, IsArray } from "class-validator";

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  userId: string;
}
