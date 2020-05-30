import { Container } from 'typedi';
import { getModelForClass } from '@typegoose/typegoose';
import { TYPES } from '../types';

export function Repository(modelClass: any): any {
  return (decoratedClass: any) => {

    Container.registerHandler({
      object: decoratedClass, index: 0, value: containerInstance => {
        return getModelForClass<typeof modelClass>(modelClass, {
          existingConnection: containerInstance.get(TYPES.DB_CONNECTION),
        });
      },
    });
  };
}
