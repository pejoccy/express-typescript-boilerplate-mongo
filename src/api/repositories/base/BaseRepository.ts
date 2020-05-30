import { ReturnModelType } from '@typegoose/typegoose';

export type IConstructor<T = any> = T & (new (...args: any[]) => T);

export abstract class BaseRepository<T> {

  protected _model: ReturnModelType<IConstructor<T>>;

  constructor(model: ReturnModelType<IConstructor<T>>) {
    this._model = model;
  }

  public async find(conditions: Partial<T> | any = {}, projection?: string): Promise<T[] | []> {
    const docs = await this._model
      .find(conditions, projection)
      .exec();
    return docs.map(doc => {
      return doc.toJSON();
    });
  }

  public async findOne(conditions: Partial<T> | any = {}, projection?: string): Promise<T | undefined> {
    const doc = await this._model
      .findOne(conditions, projection)
      .exec();
    return doc && doc.toJSON() || undefined;
  }

  public async findById(id: any, projection?: string): Promise<T | undefined> {
    return await this.findOne({ _id: id}, projection);
  }

  public async create(data: T): Promise<T> {
    const model = await this._model.create(data);
    return model && model.toJSON();
  }

  public async update(conditions: Partial<T>, doc: Partial<T>): Promise<T> {
    const user = await this._model
      .update((conditions as any), (doc as any))
      .exec();
    return user && user.toJSON() || undefined;
  }

  public async delete(conditions: Partial<T>): Promise<boolean> {
    const { ok } =  await this._model.deleteOne((conditions as any)).exec();
    // tslint:disable-next-line: triple-equals
    return ok == 1;
  }
}
