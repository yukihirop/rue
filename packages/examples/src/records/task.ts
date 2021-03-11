// third party
import { ActiveRecord } from '../lib';
import type * as t from '@rue/activerecord';

import { Account } from '@/records';

type TaskParams = {
  id: t.Record$ForeignKey;
  content: string;
  status: 'success' | 'failure' | 'wip';
  accountId: t.Record$ForeignKey;
};

export class Task extends ActiveRecord<TaskParams> {
  public content: TaskParams['content'];
  public status: TaskParams['status'];
  public accountId: TaskParams['accountId'];
  public account: t.Record$BelongsTo<Account>;
  public fromStatus: t.Record$Scope<Task>;

  protected static fetchAll(): Promise<TaskParams[]> {
    return Promise.resolve([
      { id: 1, content: 'Create @rue of web micro framework', status: 'wip', accountId: 1 },
      { id: 2, content: 'Update r2-oas gem', status: 'success', accountId: 1 },
      { id: 3, content: 'Work since morning', status: 'failure', accountId: 2 },
      { id: 4, content: 'Get it done to the end', status: 'wip', accountId: 2 },
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
