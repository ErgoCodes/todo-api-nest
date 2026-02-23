import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from 'src/lib/utils';



@Module({
  controllers: [UserController],
  providers: [UserService,UserRepository,{ provide: USER_REPOSITORY, useClass: UserRepository }],
  exports: [UserService]
})
export class UserModule {}
