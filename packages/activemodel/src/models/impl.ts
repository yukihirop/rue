// rue packages
import { Support$ImplBase } from '@rue/activesupport';

// locals
import { Validation } from '@/validations';
import { TranslationModule } from './modules';

// define static methods interface
abstract class ActiveModel$Impl extends Validation {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = Support$ImplBase.__rue_abstract_class__;
}

interface ActiveModel$Impl {
  // TranslationModule
  humanPropertyName(propKey: string): string;
  humanPropName(propKey: string): string;
}

TranslationModule.rueModuleIncludedFrom(ActiveModel$Impl, {
  only: ['humanPropertyName', 'humanPropName'],
});

TranslationModule.rueModuleExtendedFrom(ActiveModel$Impl, {
  only: ['TRANSLATE_KEY'],
});

export { ActiveModel$Impl };
