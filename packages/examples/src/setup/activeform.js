const { ActiveModel$Base, RueSetup } = require('@ruejs/rue');

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
}

exports.ActiveForm = ActiveForm;
