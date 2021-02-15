// rue packages
import { Support } from '@rue/activesupport';

// locals
import { Validation } from '@/validations';
import { TranslationModule } from './modules';

// define static methods interface
class Impl extends Validation {}

interface Impl {
  // TranslationModule
  humanPropertyName(propKey: string): string;
  humanPropName(propKey: string): string;
}

Support.moduleInclude(Impl, TranslationModule, { only: ['humanPropertyName', 'humanPropName'] });

// delegate constants
Impl['TRANSLATE_KEY'] = TranslationModule.TRANSLATE_KEY;

export { Impl };