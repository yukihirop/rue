// rue packages
import { RueCheck } from '@rue/rue';

// locals
import { ActiveRecord } from '../../lib/activerecord';

// types
import * as t from '@rue/rue';

export type UserParams = {
  // Please do not change the name 'id' arbitrarily.
  id: t.Record$ForeignKey;
  // Please do not change the name 'errors' arbitrarily.
  errors: t.Record$Validations$Errors;
  name: string;
  age: number;
};

/**
 * Check if 'uniqueKey' are overridden and if the set 'uniqueKey' overlaps with others.
 */
@RueCheck({ uniqueKey: true })
export class User extends ActiveRecord<UserParams> {
  // Please do not change the name 'id' arbitrarily.
  public id: UserParams['id'];
  public errors: UserParams['errors'];
  public name: UserParams['name'];
  public age: UserParams['age'];

  // Used for recording records, etc.
  get uniqueKey(): string {
    return 'User';
  }

  protected fetchAll(): Promise<UserParams[]> {
    throw "Please implement 'protected fetchAll(): Promise<T[]>' in Inherited Class";
  }
  save(opts?: { validate: boolean }): Promise<boolean> {
    throw "Please override 'save' to hit the external API."
  }

  saveOrThrow(): Promise<void | boolean> {
    throw "Please override 'saveOrThrow' to hit the external API."
  }

  destroy<T extends ActiveRecord$Base>(): Promise<T> {
    throw "Please override 'destroy' to hit the external API."
  }

  update<U>(params?: Partial<U>): Promise<boolean> {
    throw "Please override 'update' to hit the external API."
  }

  updateOrThrow<U>(params?: Partial<U>): Promise<boolean> {
    throw "Please override 'updateOrThrow' to hit the external API."
  }

  static create<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    throw "Please override 'static create' to hit the extenral API."
  }

  static createOrThrow<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    throw "Please override 'static createOrThrow' to hit the external API."
  }

  static delete<T extends ActiveRecord$Base>(
    id: t.Record$PrimaryKey | t.Record$PrimaryKey[]
  ): Promise<number> {
    throw "Please override 'static delete' to hit the external API."
  }

  static destroy<T extends ActiveRecord$Base>(
    id: t.Record$PrimaryKey | t.Record$PrimaryKey[]
  ): Promise<T | T[]> {
    throw "Please override 'static destroy' to hit the external API."
  }

  static update<T extends ActiveRecord$Base, U>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[] | 'all',
    params: Partial<U> | Array<Partial<U>>
  ): Promise<T | T[]> {
    throw "Please override 'static update' to hit the external API."
  }
}

/**
 * Be sure to define validations, scopes, and associations below.
 */
