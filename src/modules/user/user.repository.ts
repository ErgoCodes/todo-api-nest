import { IUserRepository } from 'src/lib/interfaces';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'generated/prisma/browser';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<User | null> {
    const response = await this.prisma.user.findUnique({ where: { email } });
    return response;
  }
  async findByUsername(username: string): Promise<User | null> {
    const response = await this.prisma.user.findUnique({ where: { username } });
    return response;
  }
  async create(item: CreateUserDto): Promise<User> {
    const response = await this.prisma.user.create({ data: item });
    return response;
  }
  async update(id: string, item: UpdateUserDto): Promise<User> {
    const response = await this.prisma.user.update({
      where: { id },
      data: item,
    });
    return response;
  }
  async delete(id: string): Promise<User> {
    const response = await this.prisma.user.delete({ where: { id } });
    return response;
  }
  async findAll(): Promise<User[]> {
    const response = await this.prisma.user.findMany();
    return response;
  }
  async findById(id: string): Promise<User | null> {
    const response = await this.prisma.user.findUnique({ where: { id } });
    return response;
  }
}
