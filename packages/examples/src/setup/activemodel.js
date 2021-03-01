const { ActiveModel$Base } = require('@rue/activemodel');

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

ActiveModel.loadTranslator();

exports.ActiveModel = ActiveModel;
