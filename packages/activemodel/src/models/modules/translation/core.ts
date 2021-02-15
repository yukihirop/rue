// locals
import { registryForTranslator as Registry } from '@/registries';

// types
import * as ast from '@rue/activesupport';
import * as rt from '@/registries';

// this is bound to an instance(class) of Translation
export const Translation: ast.Support$Module = {
  isModule: true,
  TRANSLATE_KEY: 'translate',

  humanPropertyName(propKey: string): string {
    const translate = Registry.read<rt.Translator['translate']>(
      'ActiveModel',
      Translation.TRANSLATE_KEY
    );
    return translate(propKey);
  },

  // @alias
  humanPropName(propKey: string): string {
    return this.humanPropertyName(propKey);
  },
};
