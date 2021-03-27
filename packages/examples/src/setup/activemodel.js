const { ActiveModel$Base, RueClassName } = require('@rue/activemodel');

// Prevent destroying class names by minify
@RueClassName('ActiveModel')
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
    throw 'Please override';
  }
}

exports.ActiveModel = ActiveModel;
