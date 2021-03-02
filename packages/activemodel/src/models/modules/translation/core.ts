// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { ActiveModel$Base } from '@/models';

// this is bound to an instance(class) of ActiveModel$Base
export class ActiveModel$Translation extends RueModule {
  static translate(key: string, opts?: any): string {
    throw "Please implement '[static] translate' in Inherited Class.";
  }

  humanPropertyName(propKey: string): string {
    return (this.constructor as typeof ActiveModel$Base).__t(propKey);
  }

  // @alias
  humanPropName(propKey: string): string {
    return this.humanPropertyName(propKey);
  }

  static __t(propKey: string): string {
    // @ts-ignore
    const _this = this as typeof ActiveModel$Base;
    return _this.translate(`rue.${_this.objType()}s.${_this.name}.${propKey}`).toString();
  }
}
