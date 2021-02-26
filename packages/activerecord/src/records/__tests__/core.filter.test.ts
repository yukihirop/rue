import {
  ActiveRecord$Base as Record,
  RECORD_AUTO_INCREMENNT_ID,
  RECORD_ID,
  RECORD_ALL,
} from '../base';
import { cacheForRecords as Cache } from '@/registries';

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
          TestWhereRecord.where<TestWhereRecord>({ name: 'name_1' })
            .toPromiseArray()
            .then((records) => {
              expect(records.length).toEqual(1);
              expect(records[0].name).toEqual('name_1');
              expect(records[0].age).toEqual(1);
              expect(Cache.read<TestWhereRecord[]>('TestWhereRecord', RECORD_ALL).length).toEqual(
                2
              );
              expect(Cache.read('TestWhereRecord', RECORD_ALL)[0].name).toEqual('name_1');
              expect(Cache.read('TestWhereRecord', RECORD_ALL)[0].age).toEqual(1);
              expect(Cache.read('TestWhereRecord', RECORD_ALL)[0].errors).toEqual({});
              expect(Cache.read('TestWhereRecord', RECORD_ALL)[0][RECORD_ID]).toEqual(1);
              expect(Cache.read('TestWhereRecord', RECORD_AUTO_INCREMENNT_ID)).toEqual(3);
              done();
            });
          expect(
            TestWhereRecord.where<TestWhereRecord>({ name: 'name_1' })
              .where<TestWhereRecord>({ age: 1 })
              .inspect()
          ).toEqual(
            `ActiveRecord$Filters$WhereChain {
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
            TestWhereRecord.where<TestWhereRecord>({ name: 'name_1' })
              .where<TestWhereRecord>({ age: 1 })
              .rewhere<TestWhereRecord>({ name: 'name_2' })
              .inspect()
          ).toEqual(
            `ActiveRecord$Filters$WhereChain {
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
        TestFindByRecord.findBy<TestFindByRecord>({ name: 'name_1' }).then((record) => {
          expect(record.name).toEqual('name_1');
          expect(record.age).toEqual(1);
          expect(Cache.read<TestFindByRecord[]>('TestFindByRecord', RECORD_ALL).length).toEqual(2);
          expect(Cache.read('TestFindByRecord', RECORD_ALL)[0].name).toEqual('name_1');
          expect(Cache.read('TestFindByRecord', RECORD_ALL)[0].age).toEqual(1);
          expect(Cache.read('TestFindByRecord', RECORD_ALL)[0].errors).toEqual({});
          expect(Cache.read('TestFindByRecord', RECORD_ALL)[0][RECORD_ID]).toEqual(1);
          expect(Cache.read('TestFindByRecord', RECORD_AUTO_INCREMENNT_ID)).toEqual(3);
          done();
        });
      });
    });
  });
});
