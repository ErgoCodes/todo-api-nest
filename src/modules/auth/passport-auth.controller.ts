import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { User } from '../../lib/decorators/user.decorator';
import type { RequestUser } from '../../lib/interfaces/request-user.interface';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/create-auth.dto';
import { PassportAuthGuard } from './guards/passport-guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth-v2')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportAuthGuard)
  login(@User() user: RequestUser) {
    return this.authService.signIn(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@User() user: RequestUser) {
    return user;
  }
}
