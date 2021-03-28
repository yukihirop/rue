// rue packages
const { RueCheck } = require('@rue/activerecord');

// locals
const { ActiveRecord } = require('../../lib/activerecord');

/**
 * @property {number|string} id - Please do not change the name 'id' arbitrarily.
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {number} age
 */

@RueCheck()
export class User extends ActiveRecord {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return User;
  }


  /**
   * @protected
   * @return {Promise<Array<property>>}
   */
  fetchAll() {
    throw 'Please override';
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
