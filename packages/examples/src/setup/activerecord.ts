import { ActiveRecord$Base, RueCheck } from '@rue/rue';
import type * as t from '@rue/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static i18nConfig(): t.Model$I18nConfig {
    throw "Please implement 'static i18nConfig(): t.Model$I18nConfig' in Inherited Class"
  }

  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'protected fetchAll(): Promise<T[]>' in Inherited Class";
  }
}
