import {
  ActiveRecord$Base as Record,
  RUE_AUTO_INCREMENT_RECORD_ID,
  RUE_RECORD_ID,
  RECORD_ALL,
} from '../base';
import { cacheForRecords as RecordCache } from '@/registries';

describe('Record(Filter)', () => {
  describe('[static] where', () => {
    describe('when default', () => {
      type TestWhereParams = {
        name: string;
        age: number;
      };

      class TestWhereRecord extends Record {
        public name?: TestWhereParams['name'];
        public age?: TestWhereParams['age'];
        static fetchAll<T = TestWhereParams>(): Promise<T[]> {
          // @ts-ignore
          return Promise.resolve([
            { name: 'name_1', age: 1 },
            { name: 'name_2', age: 2 },
          ]);
        }
      }

      describe("when use 'where' only", () => {
        it('should correctly', (done) => {
          TestWhereRecord.where<TestWhereRecord, TestWhereParams>({ name: 'name_1' })
            .toPromiseArray()
            .then((records) => {
              expect(records.length).toEqual(1);
              expect(records[0].name).toEqual('name_1');
              expect(records[0].age).toEqual(1);
              const cacheAll = RecordCache.read<TestWhereRecord[]>('TestWhereRecord', RECORD_ALL);
              expect(cacheAll.length).toEqual(2);
              expect(cacheAll[0].name).toEqual('name_1');
              expect(cacheAll[0].age).toEqual(1);
              expect(cacheAll[0].errors).toEqual({});
              expect(cacheAll[0][RUE_RECORD_ID]).toEqual(1);
              expect(RecordCache.read('TestWhereRecord', RUE_AUTO_INCREMENT_RECORD_ID)).toEqual(3);
              done();
            });
          expect(
            TestWhereRecord.where<TestWhereRecord, TestWhereParams>({ name: 'name_1' })
              .where<TestWhereRecord>({ age: 1 })
              .inspect()
          ).toEqual(
            `ActiveRecord$QueryMethods$WhereChain {
  \"params\": {
    \"name\": \"name_1\",
    \"age\": 1
  }
}`
          );
        });
      });

      describe("when use 'rewhere' only", () => {
        it('should correctly', () => {
          expect(
            TestWhereRecord.where<TestWhereRecord, TestWhereParams>({ name: 'name_1' })
              .where<TestWhereRecord>({ age: 1 })
              .rewhere<TestWhereRecord>({ name: 'name_2' })
              .inspect()
          ).toEqual(
            `ActiveRecord$QueryMethods$WhereChain {
  \"params\": {
    \"name\": \"name_2\"
  }
}`
          );
        });
      });
    });
  });

  describe('[static] findBy', () => {
    type TestFindByParams = {
      name: string;
      age: number;
    };

    class TestFindByRecord extends Record {
      public name?: TestFindByParams['name'];
      public age?: TestFindByParams['age'];
      static fetchAll<T = TestFindByParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
        ]);
      }
    }

    describe('when records exists', () => {
      it('should correctly', (done) => {
        TestFindByRecord.findBy<TestFindByRecord, TestFindByParams>({ name: 'name_1' }).then(
          (record) => {
            expect(record.name).toEqual('name_1');
            expect(record.age).toEqual(1);
            expect(
              RecordCache.read<TestFindByRecord[]>('TestFindByRecord', RECORD_ALL).length
            ).toEqual(2);
            expect(RecordCache.read('TestFindByRecord', RECORD_ALL)[0].name).toEqual('name_1');
            expect(RecordCache.read('TestFindByRecord', RECORD_ALL)[0].age).toEqual(1);
            expect(RecordCache.read('TestFindByRecord', RECORD_ALL)[0].errors).toEqual({});
            expect(RecordCache.read('TestFindByRecord', RECORD_ALL)[0][RUE_RECORD_ID]).toEqual(1);
            expect(RecordCache.read('TestFindByRecord', RUE_AUTO_INCREMENT_RECORD_ID)).toEqual(3);
            done();
          }
        );
      });
    });
  });
});
