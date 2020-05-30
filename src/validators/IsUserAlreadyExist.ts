import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsUserAlreadyExist(validationOptions?: ValidationOptions): any {
  return (object: any, propertyName: string): any => {
    registerDecorator({
      name: 'isUserAlreadyExist',
      async: true,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): Promise<boolean> {
          return new Promise(ok => {
            if (value !== 'admin' && value !== 'user') {
              ok(true);
            } else {
              ok(false);
            }
          });
        },
      },
    });
  };
}
