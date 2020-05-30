import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import {
  Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { PetNotFoundError } from '../errors/PetNotFoundError';
import { Pet } from '../models/Pet';
import { User } from '../models/User';
import { PetService } from '../services/PetService';
import { UserResponse } from './UserController';
import { UserJob } from '../jobs/userJob';
import { Inject } from 'typedi';

class BasePet {
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public age: number;
}

export class PetResponse extends BasePet {
  @IsString()
  public id: string;

  @ValidateNested()
  public user: UserResponse;
}

class CreatePetBody extends BasePet {
  @IsNotEmpty()
  public user: User;
}

@Authorized(['bearer', ['role_a', 'role_b']])
@JsonController('/pets')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class PetController {

  constructor(
    private petService: PetService,
    @Inject() private userJobHandler: UserJob
  ) { }

  @Get()
  @ResponseSchema(PetResponse, { isArray: true })
  public find(): Promise<Pet[]> {
    this.userJobHandler.sendEmailReport();
    return this.petService.find();
  }

  @Get('/:id')
  @OnUndefined(PetNotFoundError)
  @ResponseSchema(PetResponse)
  public one(@Param('id') id: string): Promise<Pet | undefined> {
    return this.petService.findOne(id);
  }

  @Post()
  @ResponseSchema(PetResponse)
  public create(@Body({ required: true }) body: CreatePetBody): Promise<Pet> {
    const pet = new Pet();
    pet.age = body.age;
    pet.name = body.name;
    pet.user = body.user;

    return this.petService.create(pet);
  }

  @Put('/:id')
  @ResponseSchema(PetResponse)
  public update(@Param('id') id: string, @Body() body: BasePet): Promise<Pet> {
    const pet = new Pet();
    pet.age = body.age;
    pet.name = body.name;

    return this.petService.update(id, pet);
  }

  @Delete('/:id')
  public delete(@Param('id') id: string): Promise<void> {
    return this.petService.delete(id);
  }

}
