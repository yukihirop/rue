import { ActiveModel$Base, RueCheck } from '@rue/activemodel';
import * as t from '@rue/activemodel';

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
export class ActiveForm extends ActiveModel$Base {
  static get objType(): t.Model$ObjType {
    return 'form';
  }

  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw "Please override 'static translate(key: string, opts?: any): string'";
  }
}
