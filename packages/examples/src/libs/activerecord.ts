import { Record } from '@rue/activerecord';

export class ActiveRecord extends Record {
  static translate(key: string, opts?: any): string {
    return `test.${key}`;
  }
}
