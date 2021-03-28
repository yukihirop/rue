// rue packages
const { RueCheck } = require('@rue/activemodel');

// locals
const { ActiveModel } = require('../../lib/activemodel');

/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {number} age
 */

@RueCheck();
export class TmpUser extends ActiveModel {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return TmpUser;
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
