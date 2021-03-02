import { ActiveModel$Base } from '@rue/activemodel';
import i18n from '@/locales';

// types
import type * as amt from '@rue/activemodel';

export class ActiveModel extends ActiveModel$Base {
  static objType(): amt.Model$ObjType {
    return 'model';
  }

  static translate(key: string, opts?: any): string {
    return i18n.t(key, opts);
  }
}
