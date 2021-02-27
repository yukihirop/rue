// rue packages
import { Registry } from '@rue/activesupport';

// types
import * as t from './types';

// define singletons
const registryForValidations = new Registry<t.Validations>('Validations');
const registryForTranslator = new Registry<t.Translator>('Translator');

// prettier-ignore
export {
  registryForValidations,
  registryForTranslator,
};
