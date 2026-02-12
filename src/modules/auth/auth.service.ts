import { AuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResult, SignInData } from './types';
import { RegisterDto } from './entities/register.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}
  async validate(authDto: AuthDto) {
    const user = await this.userService.findByUsername(authDto.username);
    // Simulate validation logic
    if (
      authDto.username === user?.username &&
      authDto.password === user?.password
    ) {
      return { username: authDto.username, userId: user.id };
    }
    return null;
  }
  async authenticate(authDto: AuthDto) {
    const user = await this.validate(authDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Simulate token generation
    return this.singIn({ id: user.userId, username: user.username });
  }
  async singIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.id,
      username: user.username,
    };
    const accessToken = await this.jwt.signAsync(tokenPayload);
    return { accessToken, userId: user.id, username: user.username };
  }
  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Create new user
    const newUser = await this.userService.create(registerDto);

    // Generate JWT token for the new user
    return this.singIn({ id: newUser.id, username: newUser.username });
  }
}


