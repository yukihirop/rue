const { ActiveModel$Base, RueClassName } = require('@rue/activemodel');

// Prevent destroying class names by minify
@RueClassName('ActiveForm')
class ActiveForm extends ActiveModel$Base {
  /**
   * @return {'model'|'form'|'record'}
   */
  static objType() {
    return 'form';
  }

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

exports.ActiveForm = ActiveForm;
