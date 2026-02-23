import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'newuser',
    description: 'The username for registration',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'newuser@example.com',
    description: 'The email for registration',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123!',
    description: 'The password for registration',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
