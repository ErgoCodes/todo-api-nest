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
import { User } from 'src/user/entities/user.entity';

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

  @IsUUID()
  @IsString()
  userId: string;

  @Exclude()
  user: User;

  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
