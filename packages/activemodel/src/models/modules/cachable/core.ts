// rue packages
import { RueModule } from '@ruejs/activesupport';

// locals
import { ActiveModel$Base } from '@/models';
import { registryForUniqueKeys as RegistryUniqueKeys } from '@/registries';

/**
 * At first I thought that the class name was a cache key, so I thought it was unnecessary,
 * but since the class name is destroyed by minify, use uniqueKey.
 */
export class ActiveModel$Cachable extends RueModule {
  protected __rue_uniqueKey__: string;

  _uniqueKey(): string {
    throw "Please implement '[static] uniqueKey(): string' in Inherited Class.";
  }

  static _uniqueKey(): string {
    if (this.prototype.__rue_uniqueKey__) {
      return this.prototype.__rue_uniqueKey__;
    } else {
      // @ts-expect-error
      const _this = this as typeof ActiveModel$Base;
      const instance = new _this({});
      const result = instance.uniqueKey;
      this.prototype.__rue_uniqueKey__ = result;
      return result;
    }
  }

  protected static checkUniqueKey(): boolean {
    const registeredUniqueKeys = RegistryUniqueKeys.read<string[]>('array');
    try {
      // @ts-expect-error
      const _this = this as typeof ActiveModel$Base;
      const uniqueKey = _this.uniqueKey;

      if (registeredUniqueKeys.includes(uniqueKey)) {
        throw `'${uniqueKey}' is a uniqueKey that is already in use. Please use another name`;
      } else {
        RegistryUniqueKeys.create([uniqueKey]);
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}
