import { ActiveModel$Base } from '@rue/activemodel';
import type * as amt from '@rue/activemodel';

export class ActiveModel extends ActiveModel$Base {
  static objType(): amt.Model$ObjType {
    return 'model';
  }

  static translate(key: string, opts?: any): string {
    return `test.${key}`;
  }
}
