import { Core as Record, RECORD_AUTO_INCREMENNT_ID, RECORD_ID, RECORD_ALL } from '../core';
import { cacheForRecords as Cache } from '@/registries';

describe('Record', () => {
  describe('constructor', () => {
    class TestConstructorRecord extends Record {
      public name: string;
      public age: number;
    }

    describe('when data is empty', () => {
      const record = new TestConstructorRecord();
      it('should correctly', () => {
        expect(record.errors).toEqual({});
        expect(record[RECORD_ID]).toEqual(undefined);
      });
    });

    describe('when data is not empty', () => {
      const record = new TestConstructorRecord({ name: 'name', age: 20 });
      it('should correctly', () => {
        expect(record.errors).toEqual({});
        expect(record.name).toEqual('name');
        expect(record.age).toEqual(20);
        expect(record[RECORD_ID]).toEqual(undefined);
      });
    });
  });

  describe('[static] resetCache', () => {
    class TestResetCacheRecord extends Record {}
    describe('should correctly', () => {
      TestResetCacheRecord.resetCache();
      expect(Cache.data['TestResetCacheRecord']).toEqual({
        [RECORD_AUTO_INCREMENNT_ID]: 1,
        [RECORD_ALL]: [],
      });
    });
  });

  describe('[static] all', () => {
    type TestAllParams = {
      name: string;
      age: number;
    };

    class TestAllRecord extends Record {
      public name?: TestAllParams['name'];
      public age?: TestAllParams['age'];
      protected static fetchAll<T = TestAllParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
        ]);
      }
    }

    describe('when do not exists cahce', () => {
      it('should correctly', (done) => {
        TestAllRecord.all<TestAllRecord>().then((records) => {
          expect(records.length).toEqual(2);
          expect(records[0].name).toEqual('name_1');
          expect(records[0].age).toEqual(1);
          expect(records[1].name).toEqual('name_2');
          expect(records[1].age).toEqual(2);
          expect(Cache.read<TestAllRecord[]>('TestAllRecord', RECORD_ALL).length).toEqual(2);
          expect(Cache.read('TestAllRecord', RECORD_ALL)[0].name).toEqual('name_1');
          expect(Cache.read('TestAllRecord', RECORD_ALL)[0].age).toEqual(1);
          expect(Cache.read('TestAllRecord', RECORD_ALL)[0].errors).toEqual({});
          expect(Cache.read('TestAllRecord', RECORD_ALL)[0][RECORD_ID]).toEqual(1);
          expect(Cache.read('TestAllRecord', RECORD_ALL)[1].name).toEqual('name_2');
          expect(Cache.read('TestAllRecord', RECORD_ALL)[1].age).toEqual(2);
          expect(Cache.read('TestAllRecord', RECORD_ALL)[1].errors).toEqual({});
          expect(Cache.read('TestAllRecord', RECORD_ALL)[1][RECORD_ID]).toEqual(2);
          expect(Cache.read<number>('TestAllRecord', RECORD_AUTO_INCREMENNT_ID)).toEqual(3);
          done();
        });
      });
    });
  });
});
