// rue packages
import { Support, Support$ImplBase } from '@rue/activesupport';

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

Support.rueModuleInclude(ActiveModel$Impl, TranslationModule, {
  only: ['humanPropertyName', 'humanPropName'],
});

// delegate constants
ActiveModel$Impl['TRANSLATE_KEY'] = TranslationModule.constant.TRANSLATE_KEY;

export { ActiveModel$Impl };
