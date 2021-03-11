import { ActiveRecord$Base } from '@rue/activerecord';
import i18n from '@/locales';

// types
import type * as t from '@rue/activerecord';

export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static translate(key: string, opts?: any): string {
    return i18n.t(key, opts);
  }
}
