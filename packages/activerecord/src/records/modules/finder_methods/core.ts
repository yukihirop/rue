// rue packages
import { RueModule } from '@rue/activesupport';

// classes
import { ActiveRecord$Base } from '@/records';

// this is bound to an instance(class) of Record
export class ActiveRecord$FinderMethods extends RueModule {
  static findBy<T extends ActiveRecord$Base>(params: { [key: string]: any }): Promise<T> {
    // @ts-ignore
    return (this as typeof ActiveRecord$Base)
      .where<T>(params)
      .toPromiseArray()
      .then((records) => {
        if (records.length > 0) {
          return Promise.resolve(records[0]);
        } else {
          return Promise.reject(undefined);
        }
      });
  }
}
