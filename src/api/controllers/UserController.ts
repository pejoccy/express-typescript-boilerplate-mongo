import { Type, Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import {
  Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { PetResponse } from './PetController';

class BaseUser {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public username: string;
}

export class UserResponse extends BaseUser {
  @IsString()
  @Expose({ name: 'id' })
  public _id: string;

  @Exclude({ toPlainOnly: true })
  public password: string;

  @ValidateNested({ each: true })
  @Type(() => PetResponse)
  public pets: PetResponse[];
}

class CreateUserBody extends BaseUser {
  @IsNotEmpty()
  public password: string;
}

@Authorized()
@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {

  constructor(
    private userService: UserService
  ) { }

  @Get()
  @ResponseSchema(UserResponse, { isArray: true })
  public async find(): Promise<User[]> {
    return (await this.userService.find())
      .map(user => plainToClass(User, user));
  }

  @Get('/me')
  @ResponseSchema(UserResponse)
  public async findMe(@Req() req: any): Promise<User> {
    return plainToClass(User, req.user);
  }

  @Get('/:id([a-f0-9]+)')
  @OnUndefined(UserNotFoundError)
  @ResponseSchema(UserResponse)
  public async one(@Param('id') id: string): Promise<User | undefined> {
    return plainToClass(User, await this.userService.findOne(id));
  }

  @Post()
  @OnUndefined(UserNotFoundError)
  @ResponseSchema(UserResponse)
  public async create(@Body() body: CreateUserBody): Promise<User> {
    return plainToClass(User, await this.userService.create(body as User));
  }

  @Put('/:id')
  @ResponseSchema(UserResponse)
  public async update(@Param('id') id: string, @Body() body: BaseUser): Promise<User> {
    const user = new User();
    user.email = body.email;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.username = body.username;

    return plainToClass(User, await this.userService.update(id, user));
  }

  @Delete('/:id')
  public delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

}
