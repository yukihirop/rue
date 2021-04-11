import { ActiveModel$Base, RueSetup } from '@ruejs/rue';

// types
import * as t from '@ruejs/rue';

@RueSetup
export class ActiveForm extends ActiveModel$Base {
  static get objType(): t.Model$ObjType {
    return 'form';
  }
}
