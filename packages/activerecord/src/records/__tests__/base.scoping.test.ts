import {
  ActiveRecord$Base as Record,
  RUE_AUTO_INCREMENT_RECORD_ID,
  RUE_RECORD_ID,
  RECORD_ALL,
} from '../base';
import { cacheForRecords as RecordCache } from '@/registries';

// types
import type * as t from '@/index';

describe('Record (Scoping)', () => {
  describe('[static] all', () => {
    type TestAllParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class TestAllRecord extends Record {
      public id: TestAllParams['id'];
      public name: TestAllParams['name'];
      public age: TestAllParams['age'];

      protected fetchAll(): Promise<TestAllParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }

    describe('when do not exists cahce', () => {
      it('should correctly', (done) => {
        TestAllRecord.all<TestAllRecord>().then((records: TestAllRecord[]) => {
          expect(records.length).toEqual(2);
          expect(records[0].name).toEqual('name_1');
          expect(records[0].age).toEqual(1);
          expect(records[1].name).toEqual('name_2');
          expect(records[1].age).toEqual(2);
          expect(RecordCache.read<TestAllRecord[]>('TestAllRecord', RECORD_ALL).length).toEqual(2);
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[0].name).toEqual('name_1');
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[0].age).toEqual(1);
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[0].errors).toEqual({});
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[0][RUE_RECORD_ID]).toEqual(1);
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[1].name).toEqual('name_2');
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[1].age).toEqual(2);
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[1].errors).toEqual({});
          expect(RecordCache.read('TestAllRecord', RECORD_ALL)[1][RUE_RECORD_ID]).toEqual(2);
          expect(RecordCache.read<number>('TestAllRecord', RUE_AUTO_INCREMENT_RECORD_ID)).toEqual(
            3
          );
          done();
        });
      });
    });
  });
});
