const template = Object.create({ activemodel: {}, activerecord: {}, activeform: {} });
export default template;

template.activerecord.defaultTS = `import { ActiveRecord$Base, RueCheck } from '@rue/rue';
import type * as t from '@rue/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static i18nConfig(): t.Model$I18nConfig {
    throw "Please implement 'static i18nConfig(): t.Model$I18nConfig' in Inherited Class"
  }

  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'protected fetchAll(): Promise<T[]>' in Inherited Class";
  }
}
`;

template.activerecord.defaultJS = `const { ActiveRecord$Base, RueCheck } = require('@rue/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveRecord extends ActiveRecord$Base {
  /**
   * @return {object}
   * 
   * e.g.) return value is { optoins: { lng: 'ja' }, resources }
   */
  static i18nConfig() {
    throw "Please implement 'static i18nConfig()' in Inherited Class"
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

template.activemodel.defaultTS = `import { ActiveModel$Base, RueCheck } from '@rue/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveModel extends ActiveModel$Base {
  /**
   * @return {object}
   * 
   * e.g.) return value is { optoins: { lng: 'ja' }, resources }
   */
  static i18nConfig() {
    throw "Please implement 'static i18nConfig()' in Inherited Class"
  }
}
`;

template.activemodel.defaultJS = `const { ActiveModel$Base, RueCheck } = require('@rue/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveModel extends ActiveModel$Base {
  /**
   * @return {object}
   * 
   * e.g.) return value is { optoins: { lng: 'ja' }, resources }
   */
  static i18nConfig() {
    throw "Please implement 'static i18nConfig()' in Inherited Class"
  }
}

exports.ActiveModel = ActiveModel;
`;

template.activeform.defaultTS = `import { ActiveModel$Base, RueCheck } from '@rue/rue';
import * as t from '@rue/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveForm extends ActiveModel$Base {
  static get objType(): t.Model$ObjType {
    return 'form';
  }

  static i18nConfig(): t.Model$I18nConfig {
    throw "Please implement 'static i18nConfig(): t.Model$I18nConfig' in Inherited Class"
  }
}
`;

template.activeform.defaultJS = `const { ActiveModel$Base, RueCheck } = require('@rue/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveForm extends ActiveModel$Base {
  /**
   * @return {'model'|'form'|'record'}
   */
  static get objType() {
    return 'form';
  }

  /**
   * @return {object}
   * 
   * e.g.) return value is { optoins: { lng: 'ja' }, resources }
   */
  static i18nConfig() {
    throw "Please implement 'static i18nConfig()' in Inherited Class"
  }
}

exports.ActiveForm = ActiveForm;
`;
