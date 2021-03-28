// rue packages
import { RueCheck } from '@rue/activemodel';

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

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
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

  // Used for recording records, etc.
  get uniqueKey(): string {
    return 'ContactForm';
  }

  submit(): Promise<boolean> {
    throw "Please override 'submit()'";
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
