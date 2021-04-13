const template = Object.create({
  bootstrap: {},
  activemodel: {},
  activerecord: {},
  activeform: {},
});
export default template;

template.bootstrap.defaultTS = `import { Rue } from '@ruejs/rue';

/**
 * Please Override 'i18n.resources'. 'i18n.resources' is a translation file of activerecord/activemodel/activeform.
 */
Rue.configure({
  i18n: {
    options: {
      lng: 'en',
    },
  },
});
`;

template.bootstrap.defaultJS = `const { Rue } = require('@ruejs/rue');

/**
 * Please Override 'i18n.resources'. 'i18n.resources' is a translation file of activerecord/activemodel/activeform.
 */
Rue.configure({
  i18n: {
    options: {
      lng: 'en',
    },
  },
});
`;

template.activerecord.defaultTS = `import { ActiveRecord$Base, RueSetup } from '@ruejs/rue';
import type * as t from '@ruejs/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  protected fetchAll(): Promise<T[]> {
    throw "Please implement 'protected fetchAll(): Promise<T[]>' in Inherited Class";
  }
}
`;

template.activerecord.defaultJS = `const { ActiveRecord$Base, RueSetup } = require('@ruejs/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveRecord extends ActiveRecord$Base {
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

template.activemodel.defaultTS = `import { ActiveModel$Base, RueSetup } from '@ruejs/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveModel extends ActiveModel$Base {}
`;

template.activemodel.defaultJS = `const { ActiveModel$Base, RueSetup } = require('@ruejs/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveModel extends ActiveModel$Base {}

exports.ActiveModel = ActiveModel;
`;

template.activeform.defaultTS = `import { ActiveModel$Base, RueSetup } from '@ruejs/rue';
import * as t from '@ruejs/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveForm extends ActiveModel$Base {
  static get objType(): t.Model$ObjType {
    return 'form';
  }
}
`;

template.activeform.defaultJS = `const { ActiveModel$Base, RueSetup } = require('@ruejs/rue');

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
}

exports.ActiveForm = ActiveForm;
`;
