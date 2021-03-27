import { RueModule } from './base';

export type RueModuleOptions = {
  only: string[];
};

export type RueModuleAncestors = Array<typeof RueModule>;
