// third party
import { ActiveRecord } from '../lib';
import type * as t from '@rue/activerecord';

import { Account } from '@/records';

type Params = {
  primaryKey: t.Record$ForeignKey;
  content: string;
  status: 'success' | 'failure' | 'wip';
  accountId: t.Record$ForeignKey;
};

export class Task extends ActiveRecord {
  public content: Params['content'];
  public status: Params['status'];
  public accountId: Params['accountId'];
  public account: t.Record$BelongsTo<Account>;
  public fromStatus: t.Record$Scope<Task>;

  protected static fetchAll<Params>(): Promise<Array<Params>> {
    // @ts-ignore
    return Promise.resolve([
      { primaryKey: 1, content: 'Create @rue of web micro framework', status: 'wip', accountId: 1 },
      { primaryKey: 2, content: 'Update r2-oas gem', status: 'success', accountId: 1 },
      { primaryKey: 3, content: 'Work since morning', status: 'failure', accountId: 2 },
      { primaryKey: 4, content: 'Get it done to the end', status: 'wip', accountId: 2 },
    ]);
  }
}

// Register Validations
Task.validates('content', { presence: true });
Task.validates('status', { inclusion: { in: ['success', 'failure', 'wip'] } });

// Register Relashionships
Task.belongsTo('account', Account, 'accountId');

// Register Scopes
Task.scope('fromStatus', (status) => Task.where({ status }));
