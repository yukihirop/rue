const { ActiveModel$Base, RueCheck } = require('@rue/activemodel');

/**
 * Check if 'translate' are overridden
 */
@RueCheck({ translate: true })
class ActiveModel extends ActiveModel$Base {
  /**
   * @param {strinng} key
   * @param {object} opts
   * @return {string}
   */
  static translate(key, opts) {
    /**
     * e.g.) return i18n.t(key, opts)
     */
    throw "Please override 'static translate(key: string, opts?: any): string'";
  }
}

exports.ActiveModel = ActiveModel;
