// rue packages
import { Rue } from '@rue/config';

// locals
import i18n from '@/locales';

// types
import type * as t from './types';

export const RueCheck = (opts?: t.RueCheckOptions) => (target) => {
  if (!opts) opts = { uniqueKey: true };
  try {
    if (opts.uniqueKey) {
      target.checkUniqueKey();
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
  const { options, resources } = Rue.i18n;
  const { lng } = options;
  const namespace = 'translation';
  i18n.changeLanguage(lng);
  i18n.addResourceBundle(lng, namespace, resources[lng], true, true);
  return target;
};

export const RueSetup = (target) => {
  return RueSetupI18n(target);
};
