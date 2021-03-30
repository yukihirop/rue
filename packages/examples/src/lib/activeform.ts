import { ActiveModel$Base, RueSetup } from '@rue/activemodel';
import { resources } from '@/locales';

// types
import * as t from '@rue/activemodel';

@RueSetup
export class ActiveForm extends ActiveModel$Base {
  static get objType(): t.Model$ObjType {
    return 'form';
  }

  static i18nConfig(): t.Model$I18nConfig {
    return {
      options: {
        lng: 'ja',
      },
      resources,
    };
  }
}
