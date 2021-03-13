import { ActiveRecord$Base as Record } from '@/records';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

const { RUE_AUTO_INCREMENT_RECORD_ID, RECORD_ALL } = Record;

type QueryingRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

class QueryingRecord extends Record {
  public id: QueryingRecordParams['id'];
  public name: QueryingRecordParams['name'];
  public age: QueryingRecordParams['age'];

  protected fetchAll(): Promise<QueryingRecordParams[]> {
    return Promise.resolve([]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }
}

describe('ActiveRecord$Base (Querying) (delegate to QueryMethods)', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(async () => {
    MockDate.set('2021-03-05T23:03:21+09:00');
    await QueryingRecord.create<QueryingRecord, QueryingRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]);
  });

  afterEach(async () => {
    MockDate.reset();
    RecordCache.destroy(QueryingRecord.name);
    await QueryingRecord.unscope('where', 'group', 'limit', 'offset', 'order');
  });

  describe('#where (rewhere)', () => {
    describe("when use 'where' only", () => {
      it('should correctly', (done) => {
        QueryingRecord.where<QueryingRecord, QueryingRecordParams>({ name: 'name_1' }).rueThen(
          (records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                name: 'name_1',
                id: 1,
              },
            ]);
            const cacheAll = RecordCache.data[QueryingRecord.name][RECORD_ALL];
            expect(cacheAll.length).toEqual(3);
            expect(RecordCache.data[QueryingRecord.name][RUE_AUTO_INCREMENT_RECORD_ID]).toEqual(4);
            done();
          }
        );
      });
    });

    describe("when use 'rewhere'", () => {
      it('should correctly', (done) => {
        QueryingRecord.where<QueryingRecord, QueryingRecordParams>({ name: 'name_1' })
          .where<QueryingRecordParams>({ age: 1 })
          .rewhere<QueryingRecordParams>({ name: 'name_2' })
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
            ]);
            done();
          });
      });
    });
  });

  describe('[static] order', () => {
    describe("when specify 'name: 'desc''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'desc' }).then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              id: 3,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              id: 1,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'name: 'DESC''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'DESC' }).then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              id: 3,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              id: 1,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'name: 'asc''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'asc' }).then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              id: 3,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'name: 'ASC''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'ASC' }).then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              id: 3,
            },
          ]);
          done();
        });
      });
    });

    describe('when invalid direction', () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'invalid' }).rueCatch((err) => {
          expect(err.toString()).toEqual(
            "Error: Direction 'invalid' is invalid. Valid directions are: '[asc,desc,ASC,DESC]'"
          );
          done();
        });
      });
    });
  });

  describe('[static] reorder', () => {
    describe("when specify 'name: 'asc''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'desc' })
          .reorder({ name: 'asc' })
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                name: 'name_3',
                id: 3,
              },
            ]);
            done();
          });
      });
    });

    describe("when specify 'age: 'ASC''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'DESC' })
          .reorder({ age: 'ASC' })
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                name: 'name_3',
                id: 3,
              },
            ]);
            done();
          });
      });
    });

    describe("when specify 'name: 'desc''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'asc' })
          .reorder({ name: 'desc' })
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                name: 'name_3',
                id: 3,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                name: 'name_1',
                id: 1,
              },
            ]);
            done();
          });
      });
    });

    describe("when specify 'name: 'DESC''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'ASC' })
          .reorder({ name: 'DESC' })
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                name: 'name_3',
                id: 3,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                name: 'name_1',
                id: 1,
              },
            ]);
            done();
          });
      });
    });

    describe('when invalid direction', () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'invalid' })
          .reorder({ name: 'reorder' })
          .rueCatch((err) => {
            expect(err.toString()).toEqual(
              "Error: Direction 'reorder' is invalid. Valid directions are: '[asc,desc,ASC,DESC]'"
            );
            done();
          });
      });
    });
  });

  describe('[static] offset', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.offset(1).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              id: 3,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'offset' after specify 'where'", () => {
      it('should correctly', (done) => {
        QueryingRecord.where({ age: [1, 2] })
          .offset(1)
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
            ]);
            done();
          });
      });
    });

    describe("when specify 'order' after specify 'offset'", () => {
      it('should correctly', (done) => {
        QueryingRecord.offset(1)
          .order({ age: 'desc' })
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                name: 'name_1',
                id: 1,
              },
            ]);
            done();
          });
      });
    });
  });

  describe('[static] limit', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.limit(1).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              id: 1,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'where' after specify 'limit'", () => {
      it('should correctly', (done) => {
        // TODO: remove any
        QueryingRecord.where({ id: [1, 2] as any })
          .limit(1)
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                name: 'name_1',
                id: 1,
              },
            ]);
            done();
          });
      });
    });

    describe("when speicfy 'order' after specify 'limit'", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'desc' })
          .limit(2)
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                name: 'name_3',
                id: 3,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
            ]);
            done();
          });
      });
    });
  });

  describe('[static] group', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.create([{ id: 4, name: 'name_2', age: 2 }]);
        QueryingRecord.group<QueryingRecord, QueryingRecordParams>('name', 'age').rueThen(
          (grouped) => {
            expect(grouped).toEqual({
              '[name_1,1]': [
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 1,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _destroyed: false,
                  _newRecord: false,
                  age: 1,
                  errors: {},
                  name: 'name_1',
                  id: 1,
                },
              ],
              '[name_2,2]': [
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 2,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _destroyed: false,
                  _newRecord: false,
                  age: 2,
                  errors: {},
                  name: 'name_2',
                  id: 2,
                },
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 4,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _destroyed: false,
                  _newRecord: false,
                  age: 2,
                  errors: {},
                  name: 'name_2',
                  id: 4,
                },
              ],
              '[name_3,3]': [
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 3,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _destroyed: false,
                  _newRecord: false,
                  age: 3,
                  errors: {},
                  name: 'name_3',
                  id: 3,
                },
              ],
            });
            done();
          }
        );
      });
    });
  });

  describe('[static] unscope', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.where({ name: 'name_1' })
          .unscope('where')
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                name: 'name_3',
                id: 3,
              },
            ]);
            done();
          });
      });
    });

    describe('when throw errors', () => {
      describe('when do not give arguments', () => {
        it('should correctly', (done) => {
          QueryingRecord.unscope().rueCatch((err) => {
            expect(err.toString()).toEqual("Error: 'unscope()' must contain arguments.");
            done();
          });
        });
      });

      describe('when give unsupported arguments', () => {
        it('should correctly', (done) => {
          QueryingRecord.unscope('unsupported' as any).rueCatch((err) => {
            expect(err.toString()).toEqual(
              "Error: Called 'unscope()' with invalid unscoping argument '[unsupported]'. Valid arguments are '[where,order,offset,limit,group]'."
            );
            done();
          });
        });
      });
    });
  });
});
