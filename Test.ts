import mongoose from 'mongoose';
import {
  prop,
  getModelForClass,
  ReturnModelType,
  DocumentType,
} from '@typegoose/typegoose';
import { Container, Inject } from 'typedi';
import { ObjectID } from 'mongodb';

(async () => {
  const {connection} = await mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'test' });
  console.log(connection.readyState);
})();
type IConstructor<T = any> = T & (new (...args: any[]) => T);

abstract class BaseRepository<T> {

  protected _model: ReturnModelType<IConstructor<T>>;

  constructor(model: ReturnModelType<IConstructor<T>>) {
    this._model = model;
  }

  public async find(query?: any): Promise<Array<DocumentType<T>>> {
    return this._model.find(query).exec();
  }

  public async findOne(query?: any): Promise<DocumentType<T>> {
    return this._model.findOne(query).exec();
  }

  public async findById(id: ObjectID): Promise<DocumentType<T>> {
    return this._model.findById(id).exec();
  }

  public async create(data: T): Promise<DocumentType<T>> {
    return this._model.create(data);
  }
}

function Repository(modelClass: any): ClassDecorator {
  return (decoratedClass: any) => {
    const model = getModelForClass<typeof modelClass>(modelClass);
    Container.registerHandler({
      object: decoratedClass, index: 0, value: () => model,
    });
  };
}

class User {
  @prop()
  public name?: string;
}

@Repository(User)
class UserRepository extends BaseRepository<User> {

  constructor(model: ReturnModelType<IConstructor<User>>) {
    super(model);
  }
  public async findByName(name: string): Promise<Array<DocumentType<User>>> {
    return this.find({ name });
  }
}

class Abc {
  constructor(
    @Inject(() => UserRepository) private userRepo: UserRepository,
    @Inject(() => UserRepository) private aRepo: UserRepository
  ) {}

  public async log(): Promise<void> {
    console.log(this.aRepo.find);
    // const muser = await this.userRepo.create({name: 'John Doe'});
    const user = await this.userRepo.findOne({_id: '5ecd518da8aa0722c1f47cf0'});
    console.log({ user });
  }
}

const abc = Container.get(Abc);
abc.log();

// const repo = Container.get(UserRepository);
// repo.create({name: 'David'}).then(resp => console.log(resp));
