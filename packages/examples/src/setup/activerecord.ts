import { ActiveRecord$Base } from '@rue/activerecord';

export class ActiveRecord extends ActiveRecord$Base {
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

ActiveRecord.loadTranslator();
