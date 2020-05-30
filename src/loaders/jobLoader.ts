import glob from 'glob';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { env } from '../env';

/**
 * jobLoader
 * ------------------------------
 * This loads all the created jobs into the project, so we do not have to
 * import them manually
 */
export const jobLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const patterns = env.app.dirs.jobs;
    patterns.forEach((pattern) => {
      glob(pattern, (err: any, files: string[]) => {
        for (const file of files) {
          require(file);
        }
      });
    });
  }
};
