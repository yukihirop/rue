// rue packages
const { RueCheck } = require('@ruejs/rue');

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

  /**
   * @param {{ validate: boolean }} opts
   * @return {Promise<boolean>}
   */
  save(opts = undefined) {
    throw "Please override 'save' to hit the external API.";
  }

  /**
   * @return {Promise<void | boolean>}
   */
  saveOrThrow() {
    throw "Please override 'saveOrThrow' to hit the external API.";
  }

  /**
   * @return {Promise<ActiveRecord$Base>}
   */
  destroy() {
    throw "Please override 'destroy' to hit the external API.";
  }

  /**
   * @param {object} params
   * @return {Promise<boolean>}
   */
  update(params = undefined) {
    throw "Please override 'update' to hit the external API.";
  }

  /**
   * @param {object} params
   * @return {Promise<boolean>}
   */
  updateOrThrow(params = undefined) {
    throw "Please override 'updateOrThrow' to hit the external API.";
  }

  /**
   * @param {object | Array<object>} params
   * @param {(self) => void} yielder
   * @return {Promise<T | T[]>}
   */
  static create(params = undefined, yielder = undefined) {
    throw "Please override 'static create' to hit the extenral API.";
  }

  /**
   * @param {object | Array<object>} params
   * @param {(self) => void} yielder
   * @return {Promise<T | T[]>}
   */
  static createOrThrow(params = undefined, yielder = undefined) {
    throw "Please override 'static createOrThrow' to hit the external API.";
  }

  /**
   * @param {stirng|number|Array<string|number>} id
   * @return {Promise<number>}
   */
  static delete(id) {
    throw "Please override 'static delete' to hit the external API.";
  }

  /**
   * @param {string|number|Array<string|number>} id
   * @return {Promise<T | T[]>}
   */
  static destroy(id) {
    throw "Please override 'static destroy' to hit the external API.";
  }

  /**
   * @param {string|number|Array<string|number>| 'all'} id
   * @param {object|Array<object>} params
   * @return {Promise<T | T[]>}
   */
  static update(id, params) {
    throw "Please override 'static update' to hit the external API.";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
