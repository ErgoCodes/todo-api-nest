import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Milk, Eggs, Bread',
    description: 'The description of the todo',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the todo is completed',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;

  @ApiPropertyOptional({
    example: ['personal', 'shopping'],
    description: 'Tags associated with the todo',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
