import { User } from "generated/prisma/browser";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";
import { UpdateUserDto } from "src/modules/user/dto/update-user.dto";
import { IRepository } from "./IRepository";


export interface IUserRepository extends IRepository<User, CreateUserDto, UpdateUserDto> {
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
}