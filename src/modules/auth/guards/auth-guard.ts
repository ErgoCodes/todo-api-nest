import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = this.jwt.verify(token);
      request.user = {
        userId: user.sub,
        username: user.username,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
