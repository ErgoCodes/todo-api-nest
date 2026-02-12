import { Exclude } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class Todo {
  @IsUUID()
  @IsString()
  id: string;

  @IsString()
  @MaxLength(50)
  @MinLength(3)
  title: string;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsBoolean()
  completed: boolean;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
