const template = Object.create({ activemodel: {}, activerecord: {}, activeform: {} });
export default template;

template.activerecord.defaultTS = `import { ActiveRecord$Base } from '@rue/activerecord';

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

template.activerecord.defaultJS = `const { ActiveRecord$Base } = require('@rue/activerecord');

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

template.activemodel.defaultTS = `import { ActiveModel$Base } from '@rue/activemodel';

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

template.activemodel.defaultJS = `const { ActiveModel$Base } = require('@rue/activemodel');

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

template.activeform.defaultTS = `import { ActiveModel$Base } from '@rue/activemodel';
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

template.activeform.defaultJS = `const { ActiveModel$Base } = require('@rue/activemodel');

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
