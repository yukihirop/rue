// rue packages
const { RueClassName } = require('@rue/activemodel');

// locals
const { ActiveModel } = require('../../lib/activemodel');

/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
 * @property {string} name
 * @property {number} age
 */

// Prevent destroying class names by minify
@RueClassName('TmpUser')
export class TmpUser extends ActiveModel {
}
