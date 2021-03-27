// rue packages
import { RueClassName } from '@rue/activerecord';

// locals
import { ActiveModel } from '../../lib/activemodel';

// types
import * as t from '@rue/activemodel';

export type TmpUserParams = {
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Model$Validations$Errors;
  name: string;
  age: number;
};

// Prevent destroying class names by minify
@RueClassName('TmpUser')
export class TmpUser extends ActiveModel {
  // Please do not change the name 'errors' arbitrarily.
  public errors: TmpUserParams['errors'];
  public name: TmpUserParams['name'];
  public age: TmpUserParams['age'];
}
