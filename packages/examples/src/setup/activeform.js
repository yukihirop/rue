const { ActiveModel$Base, RueCheck } = require('@rue/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveForm extends ActiveModel$Base {
  /**
   * @return {'model'|'form'|'record'}
   */
  static get objType() {
    return 'form';
  }

  /**
   * @return {object}
   * 
   * e.g.) return value is { optoins: { lng: 'ja' }, resources }
   */
  static i18nConfig() {
    throw "Please implement 'static i18nConfig()' in Inherited Class"
  }
}

exports.ActiveForm = ActiveForm;
