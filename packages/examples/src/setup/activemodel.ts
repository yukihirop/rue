import { ActiveModel$Base, RueCheck } from '@rue/activemodel';

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
export class ActiveModel extends ActiveModel$Base {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw "Please override 'static translate(key: string, opts?: any): string'";
  }
}
