import { ActiveRecord$Base, RueSetup } from '@ruejs/rue';
import type * as t from '@ruejs/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'protected fetchAll(): Promise<T[]>' in Inherited Class";
  }
}
