// rue packages
const { RueCheck } = require('@rue/activemodel');

// locals
const { ActiveForm } = require('../../lib/activeform')

/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {string} email
 */

@RueCheck()
export class ContactForm extends ActiveForm {
  /**
   * @property {object} _state
   */
  constructor() {
    super()
    /**
     * @private
     */
    this._state = {};
    throw "Please override 'this._state'";
  }

  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return ContactForm;
  }

  submit() {
    throw "Please override 'submit()'";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
