import { ActiveModel$Base } from '@rue/activemodel';
import i18n from '@/locales';

// types
import * as t from '@rue/activemodel';

export class ActiveForm extends ActiveModel$Base {
  static objType(): t.Model$ObjType {
    return 'form';
  }

  static translate(key: string, opts?: any): string {
    return i18n.t(key, opts);
  }
}
