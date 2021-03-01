import { ActiveRecord$Base } from '@rue/activerecord';

export class ActiveRecord extends ActiveRecord$Base {
  static translate(key: string, opts?: any): string {
    return `test.${key}`;
  }
}
