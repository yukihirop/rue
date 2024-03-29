import { ActiveRecord$Base as Record, RECORD_ALL } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

describe('ActiveRecord$Base (Core)', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('[static] find', () => {
    type FindRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FindRecord extends Record<FindRecordParams> {
      public id: FindRecordParams['id'];
      public name: FindRecordParams['name'];
      public age: FindRecordParams['age'];

      get uniqueKey(): string {
        return 'FindRecord';
      }
    }

    beforeEach(() => {
      RecordCache.destroy(FindRecord.name);
      FindRecord.create<FindRecord, FindRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
      ]);
    });

    describe('when default', () => {
      it('should correctly', () => {
        expect(RecordCache.data[FindRecord.name][RECORD_ALL].length).toEqual(2);
        expect(FindRecord.find(1)).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: {},
          name: 'name_1',
          id: 1,
        });
      });
    });

    describe("when given many 'id'", () => {
      it('should correctly', () => {
        expect(RecordCache.data[FindRecord.name][RECORD_ALL].length).toEqual(2);
        expect(FindRecord.find(1, 2)).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            id: 1,
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            age: 2,
            errors: {},
            name: 'name_2',
            id: 2,
          },
        ]);
      });
    });

    describe('when throw error', () => {
      describe("when don't give 'id'", () => {
        it('should correctly', () => {
          expect(() => {
            FindRecord.find();
          }).toThrowError("Could'nt find 'FindRecord' without an 'id'");
        });
      });

      describe("when can't find record when given 'id'", () => {
        it('should correctly', () => {
          expect(() => {
            FindRecord.find(3);
          }).toThrowError("Couldn't find 'FindRecord' with 'id' = '3'");
        });
      });

      describe("when can't find record when given many 'id'", () => {
        it('should correctly', () => {
          expect(() => {
            FindRecord.find(3, 4);
          }).toThrowError(
            "Could't find all 'FindRecord' with 'id': [3,4] (found 0 results, but was looking for 2)"
          );
        });
      });
    });
  });
});
