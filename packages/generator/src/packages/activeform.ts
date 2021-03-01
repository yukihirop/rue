export const defaultJSTemplate = `const { ActiveModel$Base } = require('@rue/activemodel');

class ActiveForm extends ActiveModel$Base {
  /**
   * @return {'model'|'form'|'record'}
   */
  static objType() {
    return 'form';
  }

  /**
   * @param {strinng} key
   * @param {object} opts
   * @return {string}
   */
  static translate(key, opts) {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }
}

ActiveForm.loadTranslator();

exports.ActiveForm = ActiveForm;
`;

export const defaultTSTemplate = `import { ActiveModel$Base } from '@rue/activemodel';
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

ActiveForm.loadTranslator();
`;
