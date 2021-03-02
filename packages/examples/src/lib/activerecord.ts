import { ActiveRecord$Base } from '@rue/activerecord';
import i18n from '@/locales';

export class ActiveRecord extends ActiveRecord$Base {
  static translate(key: string, opts?: any): string {
    return i18n.t(key, opts);
  }
}
