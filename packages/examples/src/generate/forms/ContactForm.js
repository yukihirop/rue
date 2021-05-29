// rue packages
const { RueCheck } = require('@ruejs/rue');

// locals
const { ActiveForm } = require('../lib')

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {string} email
 */
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
    return 'ContactForm';
  }

  submit() {
    throw "Please override 'submit()'";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
