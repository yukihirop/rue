// rue packages
import { ActiveSupport$ImplBase as Support$ImplBase } from '@rue/activesupport';

// locals
import { ActiveModel$Translation, ActiveModel$Validations } from './modules';

// types
import * as t from './types';

// define static methods interface
abstract class ActiveModel$Impl {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = Support$ImplBase.__rue_abstract_class__;
  static __rue_ancestors__ = [];
  // ActiveModel$Translation
  static translate: (key: string, opts?: any) => string;
  static __t: (propKey: string) => string;
  // ActiveModel$Validations
  static objType: () => t.Validations$ObjType;
  static validates: <T = any, U extends ActiveModel$Validations = any>(
    propKey: string,
    opts: t.Validations$Options<T, U>
  ) => void;
}

interface ActiveModel$Impl {
  // ActiveModel$Translation
  humanPropertyName(propKey: string): string;
  humanPropName(propKey: string): string;
  // ActiveModel$Validations
  isValid(): boolean;
  isInvalid(): boolean;
  _toObj(opts?: { flat: boolean }): { [key: string]: any };
}

ActiveModel$Translation.rueModuleIncludedFrom(ActiveModel$Impl, {
  only: ['humanPropertyName', 'humanPropName'],
});
ActiveModel$Validations.rueModuleIncludedFrom(ActiveModel$Impl, {
  only: ['isInvalid', 'isValid', '_toObj'],
});

ActiveModel$Translation.rueModuleExtendedFrom(ActiveModel$Impl, {
  only: ['translate', '__t'],
});
ActiveModel$Validations.rueModuleExtendedFrom(ActiveModel$Impl, {
  only: ['objType', 'validates'],
});

export { ActiveModel$Impl };
