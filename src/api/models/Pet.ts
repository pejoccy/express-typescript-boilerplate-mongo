import { Expose } from 'class-transformer';

import { User } from './User';
import { prop, Ref, mongoose } from '@typegoose/typegoose';

export class Pet {

  @Expose({ name: 'id', toPlainOnly: true })
  @prop({ required: true, default: mongoose.Types.ObjectId })
  public _id!: string;

  @prop()
  public name!: string;

  @prop()
  public age!: number;

  @prop({ ref: 'User' })
  public user!: Ref<User>;
}
