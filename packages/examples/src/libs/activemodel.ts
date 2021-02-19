import { Model } from '@rue/activemodel';
import type * as amt from '@rue/activemodel';

export class ActiveModel extends Model {
  static objType(): amt.Model$ObjType {
    return 'model';
  }

  static translate(key: string, opts?: any): string {
    return `test.${key}`;
  }
}
