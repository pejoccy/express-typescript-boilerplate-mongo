import Agenda from 'agenda';
import { env } from '../../env';

const agenda = new Agenda({
  db: {
    collection: env.agenda.dbCollection,
    address: env.agenda.dbConnection,
    options: { useUnifiedTopology: true, useNewUrlParser: true },
  },
  processEvery: env.agenda.pooltime,
  maxConcurrency: env.agenda.concurrency,
});

agenda.start();

export { agenda };
