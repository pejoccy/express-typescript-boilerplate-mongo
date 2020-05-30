import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Service, Inject } from 'typedi';

import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class AuthService {

  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  public static comparePassword(user: User, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(password, user.password, (err, res) => {
        resolve(!err && res === true);
      });
    });
  }

  // private strategy = 'Basic';

  constructor(
    @Logger(__filename) private log: LoggerInterface,
    @Inject(() => UserRepository) private userRepository: UserRepository
  ) { }

  public parseBasicAuthFromRequest(req: express.Request): { username: string, password: string } {
    const authorization = req.header('authorization');
    const [strategy, token] = authorization && authorization.split(' ') || [];

    if (strategy === 'Basic') {
      this.log.info('Credentials provided by the client');
      const decodedBase64 = Buffer
        .from(token, 'base64')
        .toString('ascii');
      const [username, password] = decodedBase64.split(':');
      if (username && password) {
        return { username, password };
      }
    }
    // else if (strategy === 'Bearer') {

    // }

    this.log.info('No credentials provided by the client');
    return undefined;
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ username });
    if (user && await AuthService.comparePassword(user, password)) {
      return user;
    }

    return undefined;
  }

}
