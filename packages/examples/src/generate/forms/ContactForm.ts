// locals
import { ActiveForm } from '../../lib/activeform';

// types
import * as t from '@rue/activemodel';

export type ContactFormState = {
  // Please override
};

export type ContactFormParams = {
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Model$Validations$Errors;
  name: string;
  email: string;
};

export class ContactForm extends ActiveForm {
  // Please do not change the name 'errors' arbitrarily.
  public errors: ContactFormParams['errors'];
  public name: ContactFormParams['name'];
  public email: ContactFormParams['email'];
  private _state: ContactFormState;

  constructor() {
    super();
    this._state = {} as ContactFormState;
    throw "Please override 'this._state'";
  }

  submit() {
    throw 'Please override';
  }
}
