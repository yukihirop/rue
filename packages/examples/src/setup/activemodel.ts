import { ActiveModel$Base, RueCheck } from '@rue/rue';

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
export class ActiveModel extends ActiveModel$Base {
  /**
   * @return {object}
   * 
   * e.g.) return value is { optoins: { lng: 'ja' }, resources }
   */
  static i18nConfig() {
    throw "Please implement 'static i18nConfig()' in Inherited Class"
  }
}
