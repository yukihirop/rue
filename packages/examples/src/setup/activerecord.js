const { ActiveRecord$Base, RueCheck } = require('@rue/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveRecord extends ActiveRecord$Base {
  /**
   * @return {object}
   * 
   * e.g.) return value is { optoins: { lng: 'ja' }, resources }
   */
  static i18nConfig() {
    throw "Please implement 'static i18nConfig()' in Inherited Class"
  }

  /**
   * @protected
   * @return {Promise<Array<object>>}
   */
  fetchAll() {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }
}

exports.ActiveRecord = ActiveRecord;
