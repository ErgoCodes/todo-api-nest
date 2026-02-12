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
    try {
      const response = await this.prisma.user.findUnique({ where: { email } });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to find user by email');
    }
  }
  async findByUsername(username: string): Promise<User | null> {
    try {
      const response = await this.prisma.user.findUnique({ where: { username } });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to find user by username');
    }
  }
  async create(item: CreateUserDto): Promise<User> {
    try {
      const response = await this.prisma.user.create({ data: item });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to create user');
    }
  }
  async update(id: string, item: UpdateUserDto): Promise<User> {
    try {
      const response = await this.prisma.user.update({ where: { id }, data: item });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to update user');
    }
  }
  async delete(id: string): Promise<User> {
    try {
      const response = await this.prisma.user.delete({ where: { id } });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to delete user');
    }
  }
  async findAll(): Promise<User[]> {
    try {
      const response = await this.prisma.user.findMany();
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to find all users');
    }
  }
  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.prisma.user.findUnique({ where: { id } });
      return response;
    } catch (error) {
      throw new Error('Database error: Unable to find user by id');
    }
  }
}
