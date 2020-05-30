import { Service, Inject } from 'typedi';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';
import { ObjectId } from 'mongodb';
import { InvalidActionError } from '../errors/InvalidActionError';

@Service()
export class UserService {

  constructor(
    @Inject(type => UserRepository) private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) { }

  public find(): Promise<User[]> {
    this.log.info('Find all users');
    return this.userRepository.find();
  }

  public findOne(id: string): Promise<User | undefined> {
    this.log.info('Find one user');
    this.log.info('User id ', id);
    return this.userRepository.findById(id);
  }

  public async create(user: User): Promise<User> {
    try {
      this.log.info('Create a new user');
      const newUser = await this.userRepository.create(user);
      this.eventDispatcher.dispatch(events.user.created, newUser);
      return newUser;
    } catch (error) {
      if (error.name === 'MongoError') {
        throw new InvalidActionError('User with username already exists');
      }
      throw error;
    }
  }

  public update(id: string, user: Partial<User>): Promise<User> {
    this.log.info('Update a user');
    return this.userRepository.update({ _id: new ObjectId(id) }, user);
  }

  public async delete(id: string): Promise<void> {
    this.log.info('Delete a user');
    await this.userRepository.delete({ _id: new ObjectId(id) });
    return;
  }

}
