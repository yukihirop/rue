// rue packages
import { RueModule } from '@ruejs/activesupport';

// locals
import i18n from '@/locales';
import { ActiveModel$Base } from '@/models';

// this is bound to an instance(class) of ActiveModel$Base
export class ActiveModel$Translation extends RueModule {
  static translate(key: string, opts?: any): string {
    return i18n.t(key, opts).toString();
  }

  static $t(propKey: string): string {
    // @ts-expect-error
    return (this as typeof ActiveModel$Base).__t(propKey);
  }

  /**
   * @alias $t
   */
  static humanPropertyName(propKey: string): string {
    // @ts-expect-error
    return (this as typeof ActiveModel$Base).$t(propKey);
  }

  /**
   * @alias $t
   */
  static humanPropName(propKey: string): string {
    // @ts-expect-error
    return (this as typeof ActiveModel$Base).$t(propKey);
  }

  /**
   * @alias $t
   * @see https://api.rubyonrails.org/classes/ActiveModel/Translation.html#method-i-human_attribute_name
   */
  static humanAttributeName(propKey: string): string {
    // @ts-expect-error
    return (this as typeof ActiveModel$Base).$t(propKey);
  }

  $t(propKey: string): string {
    return (this.constructor as typeof ActiveModel$Base).__t(propKey);
  }

  /**
   * @alias $t
   */
  humanPropertyName(propKey: string): string {
    // @ts-expect-error
    return (this as ActiveModel$Base).$t(propKey);
  }

  /**
   * @alias $t
   */
  humanPropName(propKey: string): string {
    // @ts-expect-error
    return (this as ActiveModel$Base).$t(propKey);
  }

  /**
   * @alias $t
   * @see https://api.rubyonrails.org/classes/ActiveModel/Translation.html#method-i-human_attribute_name
   */
  humanAttributeName(propKey: string): string {
    // @ts-expect-error
    return (this as ActiveModel$Base).$t(propKey);
  }

  protected static __t(propKey: string): string {
    // @ts-ignore
    const _this = this as typeof ActiveModel$Base;
    const isEnum = propKey.startsWith('/');
    if (isEnum) {
      // e.g.) 'models.ActiveModel/status.wip'
      return _this.translate(`${_this.objType}s.${_this.uniqueKey}${propKey}`).toString();
    } else {
      // e.g.) 'models.TestHumanPropertyNameModel.profile.name'
      return _this.translate(`${_this.objType}s.${_this.uniqueKey}.${propKey}`).toString();
    }
  }
}
