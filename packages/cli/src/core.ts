// thrid party
import { run as oclifRun } from '@oclif/command';

// Load the .env environment variable so it's available for all commands
require('dotenv-expand')(require('dotenv-flow').config({ slient: true }));

export function run() {
  oclifRun()
    .then(require('@oclif/command/flush'))
    // @ts-ignore (TS complains about using `catch`)
    .catch(require('@oclif/errors/handle'));
}
