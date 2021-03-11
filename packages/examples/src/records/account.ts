// third party
import { ActiveRecord } from '../lib';
import type * as t from '@rue/activerecord';

import { Task } from '@/records';

type AccountParams = {
  id: t.Record$ForeignKey;
  name: string;
  email: string;
};

export class Account extends ActiveRecord<AccountParams> {
  public name: AccountParams['name'];
  public email: AccountParams['email'];
  public tasks: t.Record$HasMany<Task>;
  public fromName: t.Record$Scope<Account>;

  protected fetchAll(): Promise<AccountParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', email: 'name_1@example.com' },
      { id: 2, name: 'name_2', email: 'name_2@example.com' },
    ]);
  }
}

// Register Validations
Account.validates('name', { presence: true });
Account.validates('email', {
  format: { with: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
});

// Register Relashionships
Account.hasMany('tasks', Task, 'accountId');

// Register Scopes
Account.scope('fromName', (name) => Account.where({ name }));
