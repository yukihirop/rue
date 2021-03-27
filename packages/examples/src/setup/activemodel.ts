import { ActiveModel$Base, RueClassName } from '@rue/activemodel';

// Prevent destroying class names by minify
@RueClassName('ActiveModel')
export class ActiveModel extends ActiveModel$Base {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }
}
