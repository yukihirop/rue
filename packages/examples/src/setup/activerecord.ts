import { ActiveRecord$Base } from '@rue/activerecord';
import type * as t from '@rue/activerecord';

export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }

  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'fetchAll' in Inherited Class";
  }
}
