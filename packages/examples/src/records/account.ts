// third party
import { ActiveRecord } from '../lib';
import type * as t from '@rue/activerecord';

import { Task, Profile } from '@/records';

type AccountParams = {
  id: t.Record$ForeignKey;
  name: string;
  email: string;
};

export class Account extends ActiveRecord<AccountParams> {
  public name: AccountParams['name'];
  public email: AccountParams['email'];
  public tasks: t.Record$HasMany<Task>;
  public profile: t.Record$HasOne<Profile>;
  public fromName: t.Record$Scope<Account>;

  protected fetchAll(): Promise<AccountParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', email: 'name_1@example.com' },
      { id: 2, name: 'name_2', email: 'name_2@example.com' },
      { id: 3, name: 'name_3', email: 'name_3@example.com' },
      { id: 4, name: 'name_4', email: 'name_4@example.com' },
      { id: 5, name: 'name_5', email: 'name_5@example.com' },
      { id: 6, name: 'name_6', email: 'name_6@example.com' },
      { id: 7, name: 'name_7', email: 'name_7@example.com' },
    ]);
  }

  buildProfile(params?: t.Record$Params): Promise<Profile> {
    return this.buildHasOneRecord('profile', params);
  }
}

// Register Validations
Account.validates('name', { presence: true });
Account.validates('email', {
  format: { with: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
});

// Register Relashionships
Account.hasMany<Task>('tasks', { klass: Task, foreignKey: 'accountId' });
Account.hasOne<Profile>('profile', { klass: Profile, foreignKey: 'accountId' });

// Register Scopes
Account.scope('fromName', (name) => Account.where({ name }));
