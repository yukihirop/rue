// rue packages
const { RueCheck } = require('@ruejs/rue');

// locals
const { ActiveModel } = require('../../lib');

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {number} age
 */
export class TmpUser extends ActiveModel {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return 'TmpUser';
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
