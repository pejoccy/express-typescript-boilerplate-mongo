import { Exclude, Expose, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';
import { arrayProp, mongoose, pre, prop, Ref } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';

import { Pet } from './Pet';
import { AuthService } from '../services/AuthService';

@ObjectType({ description: 'User object.' })
@pre<User>('save', async function(): Promise<void> {
  this.password = await AuthService.hashPassword(this.password);
})
export class User {

  @Expose({ name: 'id', toPlainOnly: true })
  @Transform((v: ObjectId) => v && v.toString())
  @prop({ default: mongoose.Types.ObjectId })
  public _id!: ObjectId;

  @prop({ required: true })
  @Field({ description: 'The first name of the user.' })
  public firstName!: string;

  @prop({ required: true })
  @Field({ description: 'The last name of the user.' })
  public lastName!: string;

  @IsNotEmpty()
  @prop({ required: true })
  @Field({ description: 'The email of the user.' })
  public email!: string;

  @prop()
  @Exclude({ toPlainOnly: true })
  public password: string;

  @prop({ required: true, unique: true })
  public username!: string;

  @arrayProp({ ref: 'Pet' })
  @Field(type => [Pet], {
    description: 'A list of pets which belong to the user.',
  })
  public pets?: Ref<Pet[]>;

  @Exclude()
  public __v: number;

  public get details(): string {
    return `${this.firstName} ${this.lastName} (${this.email})`;
  }
}
