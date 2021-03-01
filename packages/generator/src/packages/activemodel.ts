export const defaultJSTemplate = `const { ActiveModel$Base } = require('@rue/activemodel');

class ActiveModel extends ActiveModel$Base {
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

ActiveModel.loadTranslator();

exports.ActiveModel = ActiveModel;
`;

export const defaultTSTemplate = `import { ActiveModel$Base } from '@rue/activemodel';

export class ActiveModel extends ActiveModel$Base {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }
}

ActiveModel.loadTranslator();
`;
