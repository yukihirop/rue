import { ActiveRecord$Base, RueSetup } from '@rue/activerecord';
import { resources } from '@/locales';

// types
import type * as t from '@rue/activerecord';

@RueSetup
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {
  static i18nConfig(): t.Record$I18nConfig {
    return {
      options: {
        lng: 'ja',
      },
      resources,
    };
  }
}
