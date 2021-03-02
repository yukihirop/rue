// locals
import { ActiveRecord } from '../../lib/activerecord';

// types
import * as t from '@rue/activerecord';

export type UserParams = {
  // Please do not change the name 'primaryKey' arbitrarily.
  primaryKey: t.Record$ForeignKey;
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Record$Validations$Errors;
  name: string;
  age: number;
};

export class User extends ActiveRecord {
  // Please do not change the name 'primaryKey' arbitrarily.
  public primaryKey: UserParams['primaryKey'];
  public errors: UserParams['errors'];
  public name: UserParams['name'];
  public age: UserParams['age'];

  protected static fetchAll<T = UserParams>(): Promise<T[]> {
    throw 'Please override';
  }
}