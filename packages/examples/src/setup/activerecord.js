const { ActiveRecord$Base, RueSetup } = require('@ruejs/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveRecord extends ActiveRecord$Base {
  /**
   * @protected
   * @return {Promise<Array<object>>}
   */
  fetchAll() {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }
}

exports.ActiveRecord = ActiveRecord;
