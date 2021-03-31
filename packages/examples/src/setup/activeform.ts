import { ActiveModel$Base, RueCheck } from '@rue/rue';
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
