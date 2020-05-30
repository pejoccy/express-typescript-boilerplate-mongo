import { mongoose } from '@typegoose/typegoose';
import { Container } from 'typedi';
import { env } from '../env';
import { TYPES } from '../types';
import { Logger } from '../lib/logger/Logger';

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

export interface DBConnectionOptions {
  username: string;
  password: string;
  host: string;
  port: string | number;
  database: string;
}

export async function createConnection(opts: DBConnectionOptions): Promise<mongoose.Connection> {
  let dbCredentials = '';

  if (opts.password && opts.username) {
    dbCredentials = `${opts.username}:${opts.password}@`;
  }
  const uri = `mongodb://${dbCredentials}${opts.host}:${opts.port}/${opts.database}`;
  const { connection } = await mongoose.connect(
    uri,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  return connection;
}

export const mongooseLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const log = new Logger(__filename);
  const connection = await createConnection({
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    host: env.db.host,
    port: env.db.port,
  });

  if (settings) {
    settings.setData('connection', connection);
    Container.set(TYPES.DB_CONNECTION, connection);
    settings.onShutdown(() => {
      log.info('Closing db connection...');
      mongoose.disconnect();
      connection.close();
    });
  }
};
