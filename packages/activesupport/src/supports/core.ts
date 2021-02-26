// locals
import { ActiveSupport$Impl } from './impl';

export class ActiveSupport$Core extends ActiveSupport$Impl {
  static inspect(instance: any): string {
    const klassName = instance.constructor.name;
    let sorted = {};

    const keys = Object.keys(instance).sort();
    keys.forEach(function (key) {
      sorted[key] = this[key];
    }, instance);

    return `${klassName} ${JSON.stringify(sorted, null, 2)}`;
  }
}
