import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { DocumentType } from '@typegoose/typegoose';

import { User } from '../models/User';
import { PetService } from '../services/PetService';
import { UserService } from '../services/UserService';

@Service()
@Resolver(of => User)
export class UserResolver {

  constructor(
    private userService: UserService,
    private petService: PetService
  ) { }

  @Query(returns => [User])
  public users(): Promise<any> {
    return this.userService.find();
  }

  @FieldResolver()
  public async pets(@Root() user: DocumentType<User>): Promise<any> {
    return this.petService.findByUser(user);
  }

}
