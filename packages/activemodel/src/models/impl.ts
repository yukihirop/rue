// rue packages
import { ActiveSupport$ImplBase as Support$ImplBase } from '@ruejs/activesupport';

// locals
import { ActiveModel$Translation, ActiveModel$Validations, ActiveModel$Cachable } from './modules';

// types
import type * as t from './types';

// define static methods interface
abstract class ActiveModel$Impl {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = Support$ImplBase.__rue_impl_class__;
  static __rue_ancestors__ = [];
  // ActiveModel$Translation
  static $t: (propKey: string) => string;
  static humanPropertyName: (propKey: string) => string;
  static humanPropName: (propKey: string) => string;
  static humanAttributeName: (propKey: string) => string;
  static translate: (key: string, opts?: any) => string;
  static __t: (propKey: string) => string;
  protected static checkI18nOptions: () => boolean;
  // ActiveModel$Validations
  static validates: <T = any, U extends ActiveModel$Validations = any>(
    propKey: string,
    opts: t.Validations$Options<T, U>
  ) => void;
  // ActiveModel$Cachable
  protected static checkUniqueKey: () => boolean;
  static get uniqueKey(): string {
    // @ts-expect-error
    return this._uniqueKey();
  }

  /**
   * define prototype
   */

  // ActiveModel$Cachable
  get uniqueKey(): string {
    // @ts-expect-error
    return this._uniqueKey();
  }
}

interface ActiveModel$Impl {
  // ActiveModel$Translation
  $t(propKey: string): string;
  humanPropertyName(propKey: string): string;
  humanPropName(propKey: string): string;
  humanAttributeName(propKey: string): string;
  // ActiveModel$Validations
  isValid(): boolean;
  isInvalid(): boolean;
  _toObj(opts?: { flat: boolean }): { [key: string]: any };
}

ActiveModel$Translation.rueModuleIncludedFrom(ActiveModel$Impl, {
  only: ['$t', 'humanPropertyName', 'humanPropName', 'humanAttributeName'],
});
ActiveModel$Validations.rueModuleIncludedFrom(ActiveModel$Impl, {
  only: ['isInvalid', 'isValid', '_toObj'],
});
ActiveModel$Cachable.rueModuleIncludedFrom(ActiveModel$Impl, {
  only: ['_uniqueKey'],
});

ActiveModel$Translation.rueModuleExtendedFrom(ActiveModel$Impl, {
  only: ['translate', '$t', 'humanPropertyName', 'humanPropName', 'humanAttributeName', '__t'],
});
ActiveModel$Validations.rueModuleExtendedFrom(ActiveModel$Impl, {
  only: ['validates'],
});
ActiveModel$Cachable.rueModuleExtendedFrom(ActiveModel$Impl, {
  only: ['uniqueKey', 'checkUniqueKey', '_uniqueKey'],
});

export { ActiveModel$Impl };
