// types
import type * as t from './types';

export const RueCheck = (opts?: t.RueCheckOptions) => (target) => {
  if (!opts) opts = { translate: true, uniqueKey: true };
  try {
    if (opts.translate) {
      target.checkTranslate();
    }
    if (opts.uniqueKey) {
      target.checkUniqueKey();
    }
  } catch (err) {
    throw err;
  }
  return target;
};
