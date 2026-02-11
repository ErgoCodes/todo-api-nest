import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
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
  login(@Request() request) {
    console.log(request);
    return this.authService.singIn(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() request) {
    return request.user;
  }
}
