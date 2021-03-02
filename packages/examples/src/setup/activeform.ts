import { ActiveModel$Base } from '@rue/activemodel';
import * as t from '@rue/activemodel';

export class ActiveForm extends ActiveModel$Base {
  static objType(): t.Model$ObjType {
    return 'form';
  }

  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }
}
