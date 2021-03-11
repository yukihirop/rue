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
template.record.defaultTS = helper`// locals
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

export class <%- className %> extends ActiveRecord<<%- className %>Params> {
  // Please do not change the name 'id' arbitrarily.
  public id: <%- className %>Params['id'];
  public errors: <%- className %>Params['errors'];
<% Object.keys(params).forEach(function(key) { -%>
  public <%- key %>: <%- className %>Params['<%- key %>'];
<% }) -%>

  protected fetchAll(): Promise<<%- className %>Params[]> {
    throw 'Please override';
  }
}
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.record.defaultJS = helper`// locals
const { ActiveRecord } = require('<%- libPath %>');

/**
 * @property {number|string} id - Please do not change the name 'id' arbitrarily.
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */
export class <%- className %> extends ActiveRecord {
  /**
   * @protected
   * @return {Promise<Array<property>>}
   */
  fetchAll() {
    throw 'Please override';
  }
}
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.model.defaultTS = helper`// locals
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

export class <%- className %> extends ActiveModel {
  // Please do not change the name 'errors' arbitrarily.
  public errors: <%- className %>Params['errors'];
<% Object.keys(params).forEach(function(key) { -%>
  public <%- key %>: <%- className %>Params['<%- key %>'];
<% }) -%>
}
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.model.defaultJS = helper`// locals
const { ActiveModel } = require('<%- libPath %>');

/**
 * @property {object} errors - Please do not change the name 'errors' arbitrarily.
<% Object.keys(params).forEach(function(key) { -%>
 * @property {<%- params[key] %>} <%- key %>
<% }) -%>
 */
export class <%- className %> extends ActiveModel {
}
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.form.defaultTS = helper`// locals
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

  submit() {
    throw 'Please override';
  }
}
`;

/**
 * Required args
 *
 * - className
 * - params
 * - libPath
 */
template.form.defaultJS = helper`// locals
const { ActiveForm } = require('<%- libPath %>')

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

  submit() {
    throw 'Please override';
  }
}
`;
