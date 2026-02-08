import { IUserRepository } from 'src/lib/interfaces';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'generated/prisma/browser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }
  async create(item: CreateUserDto) {
    return this.prisma.user.create({ data: item });
  }
  async update(id: string, item: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: item });
  }
  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
