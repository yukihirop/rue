// rue packages
import { Registry } from '@rue/activesupport';

// types
import * as t from './types';

// define singletons
const registryForAssociations = new Registry<t.Associations>('Associations');
const registryForScopes = new Registry<t.Scopes>('Scopes');
const cacheForRecords = new Registry<t.Records>('Records');

// prettier-ignore
export {
  registryForAssociations,
  registryForScopes,
  cacheForRecords,
};
