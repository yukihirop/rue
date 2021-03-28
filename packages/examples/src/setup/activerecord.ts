import { ActiveRecord$Base, RueCheck } from '@rue/activerecord';
import type * as t from '@rue/activerecord';

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw "Please override 'static translate(key: string, opts?: any): string'";
  }

  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'fetchAll' in Inherited Class";
  }
}
