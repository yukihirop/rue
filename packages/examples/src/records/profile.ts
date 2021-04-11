// third party
import { RueCheck } from '@ruejs/rue';

// locals
import { ActiveRecord } from '../lib';

// types
import type * as t from '@ruejs/rue';

type ProfileParams = {
  id: t.Record$ForeignKey;
  firstName: string;
  lastName: string;
};

@RueCheck()
export class Profile extends ActiveRecord<ProfileParams> {
  public id: ProfileParams['id'];
  public firstName: ProfileParams['firstName'];
  public lastName: ProfileParams['lastName'];

  get uniqueKey(): string {
    return 'Profile';
  }

  protected fetchAll(): Promise<ProfileParams[]> {
    return Promise.resolve([]);
  }
}
