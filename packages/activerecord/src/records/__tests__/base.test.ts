import {
  ActiveRecord$Base as Record,
  RECORD_AUTO_INCREMENNT_ID,
  RUE_RECORD_ID,
  RECORD_ALL,
} from '../base';
import { cacheForRecords as Cache } from '@/registries';
import MockDate from 'mockdate';

describe('Record', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeAll(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterAll(() => {
    MockDate.reset();
  });

  describe('constructor', () => {
    class TestConstructorRecord extends Record {
      public name: string;
      public age: number;
    }

    describe('when data is empty', () => {
      const record = new TestConstructorRecord();
      it('should correctly', () => {
        expect(record.errors).toEqual({});
        expect(record[RUE_RECORD_ID]).toEqual(undefined);
      });
    });

    describe('when data is not empty', () => {
      const record = new TestConstructorRecord({ name: 'name', age: 20 });
      it('should correctly', () => {
        expect(record.errors).toEqual({});
        expect(record.name).toEqual('name');
        expect(record.age).toEqual(20);
        expect(record[RUE_RECORD_ID]).toEqual(undefined);
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
});
