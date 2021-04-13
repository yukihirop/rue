import { ActiveModel$Base, RueSetup } from '@ruejs/rue';
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
