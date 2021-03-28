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
import { RueCheck } from '@rue/activerecord';

// locals
import { ActiveRecord } from '<%- libPath %>';

// types
import * as t from '@rue/activerecord';

export type <%- className %>Params = {
  // Please do not change the name 'id' arbitrarily.
  id: t.Record$ForeignKey;
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Record$Validations$Errors;
<% Object.keys(params).forEach(function(key) { -%>
  <%- key %>: <%- params[key] %>;
<% }) -%>
};

@RueCheck()
export class <%- className %> extends ActiveRecord<<%- className %>Params> {
  // Please do not change the name 'id' arbitrarily.
  public id: <%- className %>Params['id'];
  public errors: <%- className %>Params['errors'];
<% Object.keys(params).forEach(function(key) { -%>
  public <%- key %>: <%- className %>Params['<%- key %>'];
<% }) -%>

  // Used for recording records, etc.
  get uniqueKey(): string {
    return <%- className %>;
  }

  protected fetchAll(): Promise<<%- className %>Params[]> {
    throw 'Please override';
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
const { RueCheck } = require('@rue/activerecord');

// locals
const { ActiveRecord } = require('<%- libPath %>');

/**
 * @property {number|string} id - Please do not change the name 'id' arbitrarily.
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */

@RueCheck()
export class <%- className %> extends ActiveRecord {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return <%- className %>;
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
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.model.defaultTS = helper`// rue packages
import { RueCheck } from '@rue/activemodel';

// locals
import { ActiveModel } from '<%- libPath %>';

// types
import * as t from '@rue/activemodel';

export type <%- className %>Params = {
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Model$Validations$Errors;
<% Object.keys(params).forEach(function(key) { -%>
  <%- key %>: <%- params[key] %>;
<% }) -%>
};

@RueCheck()
export class <%- className %> extends ActiveModel {
  // Please do not change the name 'errors' arbitrarily.
  public errors: <%- className %>Params['errors'];
<% Object.keys(params).forEach(function(key) { -%>
  public <%- key %>: <%- className %>Params['<%- key %>'];
<% }) -%>

  // Used for recording records, etc.
  get uniqueKey(): string {
    return <%- className %>;
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
const { RueCheck } = require('@rue/activemodel');

// locals
const { ActiveModel } = require('<%- libPath %>');

/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */

@RueCheck();
export class <%- className %> extends ActiveModel {
  /**
   * Used for recording records, etc.
   * 
   * @getter
   * @return {string}
   * 
   */
  get uniqueKey() {
    return <%- className %>;
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
import { RueCheck } from '@rue/activemodel';

// locals
import { ActiveForm } from '<%- libPath %>';

// types
import * as t from '@rue/activemodel';

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

@RueCheck()
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
    return <%- className %>;
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
const { RueCheck } = require('@rue/activemodel');

// locals
const { ActiveForm } = require('<%- libPath %>')

/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */

@RueCheck()
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
    return <%- className %>;
  }

  submit() {
    throw "Please override 'submit()'";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
`;
