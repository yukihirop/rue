// rue packages
import { Support } from '@rue/activesupport';

// classes
import { Record } from '@/records';

// this is bound to an instance(class) of Record
export const FinderMethods = Support.defineRueModule('ActiveRecord$FinderMethods', {
  static: {
    findBy<T extends Record>(params: { [key: string]: any }): Promise<T> {
      return (this as typeof Record)
        .where<T>(params)
        .toPromiseArray()
        .then((records) => {
          if (records.length > 0) {
            return Promise.resolve(records[0]);
          } else {
            return Promise.reject(undefined);
          }
        });
    },
  },
});
