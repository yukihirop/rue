// types
import * as t from '@/modules';

// classes
export { ActiveSupport$Registry$Base } from './base';

// signleton
import { ActiveSupport$Registry$Base } from './base';
export const registryForRueModule = new ActiveSupport$Registry$Base<t.RueModuleAncestors>(
  'RueModuleAncestors'
);

// types

// prettier-ignore
export type {
  RegistryData,
  RegistryType,
  RegistryValue,
} from './types';
