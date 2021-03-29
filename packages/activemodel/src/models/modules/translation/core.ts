// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import i18n from '@/locales';
import { ActiveModel$Base } from '@/models';

// types
import type * as lt from '@/locales';

// this is bound to an instance(class) of ActiveModel$Base
export class ActiveModel$Translation extends RueModule {
  static translate(key: string, opts?: any): string {
    return i18n.t(key, opts).toString();
  }

  static i18nConfig(): lt.I18nConfig {
    throw "Please implement 'static i18nConfig(): lt.I18nConfig' in Inherited Class.";
  }

  protected static checkI18nConfig(): boolean {
    // @ts-expect-error
    const _this = this as typeof ActiveModel$Base;
    try {
      _this.i18nConfig();
      return true;
    } catch (err) {
      throw err;
    }
  }

  humanPropertyName(propKey: string): string {
    return (this.constructor as typeof ActiveModel$Base).__t(propKey);
  }

  // @alias
  humanPropName(propKey: string): string {
    return this.humanPropertyName(propKey);
  }

  protected static __t(propKey: string): string {
    // @ts-ignore
    const _this = this as typeof ActiveModel$Base;
    return _this.translate(`${_this.objType()}s.${_this.uniqueKey}.${propKey}`).toString();
  }
}
