import { ActiveModel$Base, RueSetup } from '@rue/activemodel';
import { resources } from '@/locales';

// types
import type * as t from '@rue/activemodel';

@RueSetup
export class ActiveModel extends ActiveModel$Base {
  static i18nConfig(): t.Model$I18nConfig {
    return {
      options: {
        lng: 'ja',
      },
      resources,
    };
  }
}
