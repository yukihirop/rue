const template = Object.create({ activemodel: {}, activerecord: {}, activeform: {} });
export default template;

template.activerecord.defaultTS = `import { ActiveRecord$Base, RueCheck } from '@rue/activerecord';
import type * as t from '@rue/activerecord';

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static translate(key: string, opts?: any): string {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw "Please override 'static translate(key: string, opts?: any): string'";
  }

  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'fetchAll' in Inherited Class";
  }
}
`;

template.activerecord.defaultJS = `const { ActiveRecord$Base, RueCheck } = require('@rue/activerecord');

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
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
    throw "Please override 'static translate(key: string, opts?: any): string'";
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

template.activemodel.defaultTS = `import { ActiveModel$Base, RueCheck } from '@rue/activemodel';

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
`;

template.activemodel.defaultJS = `const { ActiveModel$Base, RueCheck } = require('@rue/activemodel');

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
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
    throw "Please override 'static translate(key: string, opts?: any): string'";
  }
}

exports.ActiveModel = ActiveModel;
`;

template.activeform.defaultTS = `import { ActiveModel$Base, RueCheck } from '@rue/activemodel';
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
`;

template.activeform.defaultJS = `const { ActiveModel$Base, RueCheck } = require('@rue/activemodel');

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
class ActiveForm extends ActiveModel$Base {
  /**
   * @return {'model'|'form'|'record'}
   */
  static get objType() {
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
    throw "Please override 'static translate(key: string, opts?: any): string'";
  }
}

exports.ActiveForm = ActiveForm;
`;
