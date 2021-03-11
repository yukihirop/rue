// locals
const { ActiveRecord } = require('../../lib/activerecord');

/**
 * @property {number|string} id - Please do not change the name 'id' arbitrarily.
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
