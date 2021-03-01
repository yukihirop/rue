export const defaultJSTemplate = `const { ActiveRecord$Base } = require('@rue/activerecord');

class ActiveRecord extends ActiveRecord$Base {
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

  /**
   * @protected
   * @return {Promise<Array<object>>}
   */
  static fetchAll() {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }
}

ActiveRecord.loadTranslator();

exports.ActiveRecord = ActiveRecord;
`;

export const defaultTSTemplate = `import { ActiveRecord$Base } from '@rue/activerecord';

export class ActiveRecord extends ActiveRecord$Base {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }

  protected static fetchAll<T = any>(): Promise<Array<T>> {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }
}

ActiveRecord.loadTranslator();
`;
