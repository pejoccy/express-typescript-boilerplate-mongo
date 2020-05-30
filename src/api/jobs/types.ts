export enum JOB_TYPES {
  SendMailReport = 'send email report',
  RegistrationEmail = 'registration email',
}

export interface JobHandler {
    new ();
}
