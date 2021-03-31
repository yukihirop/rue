// functions
import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from './types';

const SUPPORT_LANGUAGES = ['ja', 'en'];

class RueRuntimeConfig$Base {
  public i18n: t.RueRuntimeConfig['i18n'];

  configure(data: t.RueRuntimeConfig) {
    this.i18n = data['i18n'];
    this.check();
  }

  check() {
    if (!SUPPORT_LANGUAGES.includes(this.i18n.options.lng)) {
      throw errObj({
        code: ErrCodes.CONFIG_IS_INVALID,
        params: {
          body: `'i18n.options.lng' must be included in [${SUPPORT_LANGUAGES.join(', ')}]`,
        },
      });
    }

    if (
      this.i18n.options.fallbackLng &&
      !SUPPORT_LANGUAGES.includes(this.i18n.options.fallbackLng)
    ) {
      throw errObj({
        code: ErrCodes.CONFIG_IS_INVALID,
        params: {
          body: `'i18n.options.lng' must be included in [${SUPPORT_LANGUAGES.join(', ')}]`,
        },
      });
    }
  }
}

export const Rue = new RueRuntimeConfig$Base();
