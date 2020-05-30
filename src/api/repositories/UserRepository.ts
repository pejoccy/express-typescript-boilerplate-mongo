import { ReturnModelType } from '@typegoose/typegoose';
import { Repository } from '../../decorators/Repository';
import { BaseRepository } from './base/BaseRepository';
import { IConstructor } from 'mongoose/lib/types';

import { User } from '../models/User';

@Repository(User)
export class UserRepository extends BaseRepository<User>  {

  constructor(model: ReturnModelType<IConstructor<User>>) {
    super(model);
  }
}
