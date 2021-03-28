// rue packages
import { RueCheck } from '@rue/activerecord';

// locals
import { ActiveRecord } from '../../lib/activerecord';

// types
import * as t from '@rue/activerecord';

export type UserParams = {
  // Please do not change the name 'id' arbitrarily.
  id: t.Record$ForeignKey;
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Record$Validations$Errors;
  name: string;
  age: number;
};

@RueCheck()
export class User extends ActiveRecord<UserParams> {
  // Please do not change the name 'id' arbitrarily.
  public id: UserParams['id'];
  public errors: UserParams['errors'];
  public name: UserParams['name'];
  public age: UserParams['age'];

  // Used for recording records, etc.
  get uniqueKey(): string {
    return User;
  }

  protected fetchAll(): Promise<UserParams[]> {
    throw 'Please override';
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
