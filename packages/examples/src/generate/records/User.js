// rue packages
const { RueCheck } = require('@rue/rue');

// locals
const { ActiveRecord } = require('../../lib/activerecord');

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
/**
 * @property {number|string} id - Please do not change the name 'id' arbitrarily.
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {number} age
 */
export class User extends ActiveRecord {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return 'User';
  }


  /**
   * @protected
   * @return {Promise<Array<property>>}
   */
  fetchAll() {
    throw "Please override 'fetchAll()'";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
