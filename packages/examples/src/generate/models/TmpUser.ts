// rue packages
import { RueCheck } from '@rue/activemodel';

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

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
export class TmpUser extends ActiveModel {
  // Please do not change the name 'errors' arbitrarily.
  public errors: TmpUserParams['errors'];
  public name: TmpUserParams['name'];
  public age: TmpUserParams['age'];

  // Used for recording records, etc.
  get uniqueKey(): string {
    return 'TmpUser';
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
