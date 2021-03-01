const { ActiveRecord$Base } = require('@rue/activerecord');

class ActiveRecord extends ActiveRecord$Base {
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

  /**
   * @protected
   * @return {Promise<Array<object>>}
   */
  static fetchAll() {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }
}

ActiveRecord.loadTranslator();

exports.ActiveRecord = ActiveRecord;
