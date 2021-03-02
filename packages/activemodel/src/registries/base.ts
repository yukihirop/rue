// rue packages
import { Registry } from '@rue/activesupport';

// types
import * as t from './types';

// define singletons
const registryForValidations = new Registry<t.Validations>('Validations');

// prettier-ignore
export {
  registryForValidations,
};
