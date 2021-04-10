import { ActiveModel$Base, RueSetup } from '@rue/rue';

// types
import * as t from '@rue/rue';

@RueSetup
export class ActiveForm extends ActiveModel$Base {
  static get objType(): t.Model$ObjType {
    return 'form';
  }
}
