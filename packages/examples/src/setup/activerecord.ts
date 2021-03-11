import { ActiveRecord$Base } from '@rue/activerecord';
import type * as t from '@rue/activerecord';

export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }

  protected static fetchAll<T = any>(): Promise<Array<T>> {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }
}
