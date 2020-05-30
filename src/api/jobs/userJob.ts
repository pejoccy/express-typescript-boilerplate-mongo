import AgendaInterface from 'agenda';
import { Inject, Service } from 'typedi';
import { Agenda } from '../../decorators/Agenda';
import { env } from '../../env';
import { JOB_TYPES } from './types';

export interface EmailBody {
  to: string;
  subject: string;
  body: string;
}

@Service()
export class UserJob {

  constructor(
    @Inject() private emailClient: any,
    @Agenda() private agenda: AgendaInterface
  ) {
    this.definitions();
  }

  public sendEmailReport(email: string = 'admin@example.com'): void {
    this.agenda.schedule<EmailBody>(
      'in 20 minutes',
      JOB_TYPES.SendMailReport,
      { to: email, subject: 'User Registration', body: '...' }
    );
  }

  public sendRegistrationEmail(): void {
    this.agenda.now(JOB_TYPES.RegistrationEmail);
  }

  private async definitions(): Promise<void> {
    this.agenda.define<EmailBody>(
      JOB_TYPES.SendMailReport,
      { priority: 'high', concurrency: 10 },
      async job => {
        const { to, subject, body } = job.attrs.data;
        await this.emailClient.send({
          to,
          from: env.app.emailFrom,
          subject,
          body,
        });
      }
    );

    this.agenda.define<Pick<EmailBody, 'to'>>(
      JOB_TYPES.RegistrationEmail,
      async job => {
        const { to } = job.attrs.data;
        this.emailClient.send({ to });
      }
    );
  }
}
