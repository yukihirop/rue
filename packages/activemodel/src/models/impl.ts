// rue packages
import { Support } from '@rue/activesupport';

// locals
import { Validation } from '@/validations';
import { TranslationModule } from './modules';

// define static methods interface
abstract class ActiveModel$Impl extends Validation {}

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
