import { mongoose } from '@typegoose/typegoose';
import { Action } from 'routing-controllers';
import { User } from '../api/models/User';

export function currentUserChecker(connection: mongoose.Connection): (action: Action) => Promise<User | undefined> {
  return async function innerCurrentUserChecker(action: Action): Promise<User | undefined> {
    return action.request.user;
  };
}
