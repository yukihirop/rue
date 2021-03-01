import { ActiveModel$Base } from '@rue/activemodel';

export class ActiveModel extends ActiveModel$Base {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }
}

ActiveModel.loadTranslator();
