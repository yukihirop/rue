import ejs from 'ejs';

/**
 * @see https://github.com/babel/babel/blob/main/packages/babel-helpers/src/helpers.js
 */
const helper = (tpl: TemplateStringsArray) => ({
  build: (args: { [key: string]: any }): string => ejs.compile(tpl[0])(args),
});

const template = Object.create({ model: {}, record: {}, form: {} });
export default template;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.record.defaultTS = helper`// rue packages
import { RueCheck } from '@ruejs/rue';

// locals
import { ActiveRecord } from '<%- libPath %>';

// types
import * as t from '@ruejs/rue';

export type <%- className %>Params = {
  // Please do not change the name 'id' arbitrarily.
  id: t.Record$ForeignKey;
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Record$Validations$Errors;
<% Object.keys(params).forEach(function(key) { -%>
  <%- key %>: <%- params[key] %>;
<% }) -%>
};

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
export class <%- className %> extends ActiveRecord<<%- className %>Params> {
  // Please do not change the name 'id' arbitrarily.
  public id: <%- className %>Params['id'];
  public errors: <%- className %>Params['errors'];
<% Object.keys(params).forEach(function(key) { -%>
  public <%- key %>: <%- className %>Params['<%- key %>'];
<% }) -%>

  // Used for recording records, etc.
  get uniqueKey(): string {
    return '<%- className %>';
  }

  protected fetchAll(): Promise<<%- className %>Params[]> {
    throw "Please implement 'protected fetchAll(): Promise<T[]>' in Inherited Class";
  }
  save(opts?: { validate: boolean }): Promise<boolean> {
    throw "Please override 'save' to hit the external API.";
  }

  saveOrThrow(): Promise<void | boolean> {
    throw "Please override 'saveOrThrow' to hit the external API.";
  }

  destroy<T extends ActiveRecord$Base>(): Promise<T> {
    throw "Please override 'destroy' to hit the external API.";
  }

  update<U>(params?: Partial<U>): Promise<boolean> {
    throw "Please override 'update' to hit the external API.";
  }

  updateOrThrow<U>(params?: Partial<U>): Promise<boolean> {
    throw "Please override 'updateOrThrow' to hit the external API.";
  }

  static create<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    throw "Please override 'static create' to hit the extenral API.";
  }

  static createOrThrow<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    throw "Please override 'static createOrThrow' to hit the external API.";
  }

  static delete<T extends ActiveRecord$Base>(
    id: t.Record$PrimaryKey | t.Record$PrimaryKey[]
  ): Promise<number> {
    throw "Please override 'static delete' to hit the external API.";
  }

  static destroy<T extends ActiveRecord$Base>(
    id: t.Record$PrimaryKey | t.Record$PrimaryKey[]
  ): Promise<T | T[]> {
    throw "Please override 'static destroy' to hit the external API.";
  }

  static update<T extends ActiveRecord$Base, U>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[] | 'all',
    params: Partial<U> | Array<Partial<U>>
  ): Promise<T | T[]> {
    throw "Please override 'static update' to hit the external API.";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.record.defaultJS = helper`// rue packages
const { RueCheck } = require('@ruejs/rue');

// locals
const { ActiveRecord } = require('<%- libPath %>');

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
/**
 * @property {number|string} id - Please do not change the name 'id' arbitrarily.
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */
export class <%- className %> extends ActiveRecord {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return '<%- className %>';
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
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.model.defaultTS = helper`// rue packages
import { RueCheck } from '@ruejs/rue';

// locals
import { ActiveModel } from '<%- libPath %>';

// types
import * as t from '@ruejs/rue';

export type <%- className %>Params = {
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Model$Validations$Errors;
<% Object.keys(params).forEach(function(key) { -%>
  <%- key %>: <%- params[key] %>;
<% }) -%>
};

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
export class <%- className %> extends ActiveModel {
  // Please do not change the name 'errors' arbitrarily.
  public errors: <%- className %>Params['errors'];
<% Object.keys(params).forEach(function(key) { -%>
  public <%- key %>: <%- className %>Params['<%- key %>'];
<% }) -%>

  // Used for recording records, etc.
  get uniqueKey(): string {
    return '<%- className %>';
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.model.defaultJS = helper`// rue packages
const { RueCheck } = require('@ruejs/rue');

// locals
const { ActiveModel } = require('<%- libPath %>');

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */
export class <%- className %> extends ActiveModel {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return '<%- className %>';
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.form.defaultTS = helper`// rue packages
import { RueCheck } from '@ruejs/rue';

// locals
import { ActiveForm } from '<%- libPath %>';

// types
import * as t from '@ruejs/rue';

export type <%- className %>State = {
  // Please override
};

export type <%- className %>Params = {
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Model$Validations$Errors;
<% Object.keys(params).forEach(function(key) { -%>
  <%- key %>: <%- params[key] %>;
<% }) -%>
};

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
export class <%- className %> extends ActiveForm {
  // Please do not change the name 'errors' arbitrarily.
  public errors: <%- className %>Params['errors'];
<% Object.keys(params).forEach(function(key) { -%>
  public <%- key %>: <%- className %>Params['<%- key %>'];
<% }) -%>
  private _state: <%- className %>State;

  constructor() {
    super();
    this._state = {} as <%- className %>State;
    throw "Please override 'this._state'";
  }

  // Used for recording records, etc.
  get uniqueKey(): string {
    return '<%- className %>';
  }

  submit(): Promise<boolean> {
    throw "Please override 'submit()'";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.form.defaultJS = helper`// rue packages
const { RueCheck } = require('@ruejs/rue');

// locals
const { ActiveForm } = require('<%- libPath %>')

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */
export class <%- className %> extends ActiveForm {
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
    return '<%- className %>';
  }

  submit() {
    throw "Please override 'submit()'";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
`;
