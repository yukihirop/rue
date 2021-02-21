// rue packages
import { Support } from '@rue/activesupport';

// locals
import { registryForTranslator as Registry } from '@/registries';

// types
import * as rt from '@/registries';

// this is bound to an instance(class) of Translation
export const Translation = Support.defineRueModule('ActiveModel$Translation', {
  constant: {
    TRANSLATE_KEY: 'translate',
  },
  instance: {
    humanPropertyName(propKey: string): string {
      const translate = Registry.read<rt.Translator['translate']>(
        'ActiveModel',
        Translation.constant.TRANSLATE_KEY
      );
      return translate(propKey);
    },

    // @alias
    humanPropName(propKey: string): string {
      return this.humanPropertyName(propKey);
    },
  },
});
