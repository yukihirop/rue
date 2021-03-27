const template = Object.create({ activemodel: {}, activerecord: {}, activeform: {} });
export default template;

template.activerecord.defaultTS = `import { ActiveRecord$Base, RueClassName } from '@rue/activerecord';
import type * as t from '@rue/activerecord';

// Prevent destroying class names by minify
@RueClassName('ActiveRecord')
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw 'Please override';
  }

  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'fetchAll' in Inherited Class";
  }
}
`;

template.activerecord.defaultJS = `const { ActiveRecord$Base, RueClassName } = require('@rue/activerecord');

// Prevent destroying class names by minify
@RueClassName('ActiveRecord')
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
  fetchAll() {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }
}

exports.ActiveRecord = ActiveRecord;
`;

template.activemodel.defaultTS = `import { ActiveModel$Base, RueClassName } from '@rue/activemodel';

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
`;

template.activemodel.defaultJS = `const { ActiveModel$Base, RueClassName } = require('@rue/activemodel');

// Prevent destroying class names by minify
@RueClassName('ActiveModel')
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

exports.ActiveModel = ActiveModel;
`;

template.activeform.defaultTS = `import { ActiveModel$Base, RueClassName } from '@rue/activemodel';
import * as t from '@rue/activemodel';

// Prevent destroying class names by minify
@RueClassName('ActiveForm')
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
`;

template.activeform.defaultJS = `const { ActiveModel$Base, RueClassName } = require('@rue/activemodel');

// Prevent destroying class names by minify
@RueClassName('ActiveForm')
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

exports.ActiveForm = ActiveForm;
`;
