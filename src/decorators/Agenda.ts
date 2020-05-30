import { Container } from 'typedi';
import { agenda } from '../lib/agenda/Agenda';

export function Agenda(): ParameterDecorator {
  return (object, propertyKey, index): any => {
    const propertyName = propertyKey ? propertyKey.toString() : '';
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: () => agenda,
    });
  };
}
