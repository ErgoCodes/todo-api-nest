import { Controller, Get, Post, Body, Patch, Param, Delete, NotImplementedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './guards/auth-guard';
import { RegisterDto } from './entities/register.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() authDto: AuthDto) {
    console.log('Received login request with data:', authDto);
    return this.authService.authenticate(authDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    console.log('Received register request with data:', registerDto);
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() request) {   
    return request.user;
  }

}
  
