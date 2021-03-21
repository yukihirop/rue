// third party
import { ActiveRecord } from '../lib';
import type * as t from '@rue/activerecord';

type ProfileParams = {
  id: t.Record$ForeignKey;
  firstName: string;
  lastName: string;
};

export class Profile extends ActiveRecord<ProfileParams> {
  public id: ProfileParams['id'];
  public firstName: ProfileParams['firstName'];
  public lastName: ProfileParams['lastName'];

  protected fetchAll(): Promise<ProfileParams[]> {
    return Promise.resolve([]);
  }
}
