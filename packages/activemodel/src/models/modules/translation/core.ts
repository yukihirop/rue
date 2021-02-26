// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { registryForTranslator as Registry } from '@/registries';

// types
import * as rt from '@/registries';

export class ActiveSupport$Translation extends RueModule {
  static TRANSLATE_KEY = 'translate';

  humanPropertyName(propKey: string): string {
    const translate = Registry.read<rt.Translator['translate']>(
      'ActiveModel',
      ActiveSupport$Translation.TRANSLATE_KEY
    );
    return translate(propKey);
  }

  // @alias
  humanPropName(propKey: string): string {
    return this.humanPropertyName(propKey);
  }
}
