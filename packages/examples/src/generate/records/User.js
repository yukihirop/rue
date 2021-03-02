// locals
const { ActiveRecord } = require('../../lib/activerecord');

/**
 * @property {number|string} primaryKey - Please do not change the name 'primaryKey' arbitrarily.
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {number} age
 */
export class User extends ActiveRecord {
  /**
   * @protected
   * @return {Promise<Array<property>>}
   */
  static fetchAll() {
    throw 'Please override';
  }
}
