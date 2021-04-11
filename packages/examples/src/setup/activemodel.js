const { ActiveModel$Base, RueSetup } = require('@ruejs/rue');

/**
 * Execute i18nConfig to configure i18next.
 */
@RueSetup
class ActiveModel extends ActiveModel$Base {}

exports.ActiveModel = ActiveModel;
