// locals
const { ActiveForm } = require('../../lib/activeform')

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

  submit() {
    throw 'Please override';
  }
}
