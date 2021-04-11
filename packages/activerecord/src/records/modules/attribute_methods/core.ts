// rue packages
import { RueModule } from '@ruejs/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';

// types
import type * as it from '@/index';

const IGNORE_PROPERTIES = ['errors', '_newRecord', '_destroyed', '_associationCache'];

export class ActiveRecord$AttributeMethods extends RueModule {
  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods.html#method-i-attributeshttps://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods.html#method-i-attributes
   */
  attributes(): Partial<it.Record$Params> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    return Object.keys(_this).reduce((acc, key) => {
      if (!IGNORE_PROPERTIES.includes(key) && typeof _this[key] != 'function') {
        acc[key] = _this[key];
      }
      return acc;
    }, {} as it.Record$Params);
  }

  /**
   * @alias attributes
   */
  properties(): Partial<it.Record$Params> {
    return this.attributes();
  }
}
