import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/lib/constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule,
    JwtModule.register({
      secret:JWT_SECRET,
      global:true,
      signOptions:{expiresIn:'2m'}
    })
  ],
})
export class AuthModule {}
