// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { ActiveModel$Base } from '@/models';
import { registryForUniqueKeys as RegistryUniqueKeys } from '@/registries';

/**
 * Methods are defined to prevent corruption of class name by minification
 */
export class ActiveModel$MinifyMeasures extends RueModule {
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
