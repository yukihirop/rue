import i18n from '@/locales';

// types
import type * as t from './types';
import type * as lt from '@/locales';

export const RueCheck = (opts?: t.RueCheckOptions) => (target) => {
  if (!opts) opts = { uniqueKey: true, i18nConfig: true };
  try {
    if (opts.uniqueKey) {
      target.checkUniqueKey();
    }
    if (opts.i18nConfig) {
      target.checkI18nConfig();
    }
  } catch (err) {
    throw err;
  }
  return target;
};

/**
 * @see https://www.i18next.com/overview/api#addresourcebundle
 */
const RueSetupI18n = (target) => {
  const { options, resources } = target.i18nConfig() as lt.I18nConfig;
  const { lng } = options;
  const namespace = 'translation';
  i18n.changeLanguage(lng);
  i18n.addResourceBundle(lng, namespace, resources[lng], true, true);
  return target;
};

export const RueSetup = (target) => {
  return RueSetupI18n(target);
};
