import { ActiveModel$Base, RueSetup } from '@rue/rue';
import { resources } from '@/locales';

// types
import * as t from '@rue/rue';

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
