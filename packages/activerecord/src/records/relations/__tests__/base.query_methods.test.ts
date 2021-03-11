import { ActiveRecord$Base as Record } from '@/records';
import { ActiveRecord$Relation as Relation } from '@/records/relations';
import { cacheForRecords as RecordCache } from '@/registries';

// thrid party
import MockDate from 'mockdate';

// types
import type * as at from '@/records/modules/associations';

const { RECORD_ALL, RUE_AUTO_INCREMENT_RECORD_ID } = Record;

type QueryMethodsRecordParams = {
  id: at.Associations$PrimaryKey;
  name: string;
  age: number;
};

class QueryMethodsRecord extends Record {
  public id: QueryMethodsRecordParams['id'];
  public name: QueryMethodsRecordParams['name'];
  public age: QueryMethodsRecordParams['age'];

  protected static fetchAll<T = QueryMethodsRecordParams>(): Promise<T[]> {
    return Promise.resolve([]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }
}

class QueryMethodsRelation extends Relation<QueryMethodsRecord> {}

describe('ActiveRecord$Relation<T> (QueryMethods)', () => {
  let relation = new QueryMethodsRelation(QueryMethodsRecord, []);

  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
    relation.create({ id: 1, name: 'name_1', age: 1 });
    relation.create({ id: 2, name: 'name_2', age: 2 });
    relation.create({ id: 3, name: 'name_3', age: 3 });
  });

  afterEach(() => {
    MockDate.reset();
    RecordCache.destroy(QueryMethodsRecord.name);

    // Actually, relation is not reused, so this process is not necessary.

    // @ts-expect-error
    relation.records = [];
    // @ts-expect-error
    relation._scopeParams = {
      where: {},
      order: {},
      offset: 0,
      limit: 0,
      group: [],
    };
  });

  describe('#where (rewhere)', () => {
    describe("when use 'where' only", () => {
      it('should correctly', (done) => {
        relation
          .where<QueryMethodsRecordParams>({ name: 'name_1' })
          .toPromiseArray()
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
            ]);
            const cacheAll = RecordCache.data[QueryMethodsRecord.name][RECORD_ALL];
            expect(cacheAll.length).toEqual(3);
            expect(RecordCache.data[QueryMethodsRecord.name][RUE_AUTO_INCREMENT_RECORD_ID]).toEqual(
              4
            );
            done();
          });
      });
    });

    describe("when use 'rewhere'", () => {
      it('should correctly', (done) => {
        relation
          .where<QueryMethodsRecordParams>({ name: 'name_1' })
          .where<QueryMethodsRecordParams>({ age: 1 })
          .rewhere<QueryMethodsRecordParams>({ name: 'name_2' })
          .toPA()
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

  describe('#order', () => {
    describe("when specify 'name: 'desc''", () => {
      it('should correctly', (done) => {
        relation
          .order({ name: 'desc' })
          .toPA()
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
        relation
          .order({ name: 'DESC' })
          .toPA()
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

    describe("when specify 'name: 'asc''", () => {
      it('should correctly', (done) => {
        relation
          .order({ age: 'asc' })
          .toPA()
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

    describe("when specify 'name: 'ASC''", () => {
      it('should correctly', (done) => {
        relation
          .order({ age: 'ASC' })
          .toPA()
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

    describe('when invalid direction', () => {
      it('should correctly', (done) => {
        relation
          .order({ name: 'invalid' })
          .toPA()
          .catch((err) => {
            expect(err.toString()).toEqual(
              "Error: Direction 'invalid' is invalid. Valid directions are: '[asc,desc,ASC,DESC]'"
            );
            done();
          });
      });
    });
  });

  describe('#reorder', () => {
    describe("when specify 'name: 'asc''", () => {
      it('should correctly', (done) => {
        relation
          .order({ name: 'desc' })
          .reorder({ name: 'asc' })
          .toPA()
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
        relation
          .order({ name: 'DESC' })
          .reorder({ age: 'ASC' })
          .toPA()
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
        relation
          .order({ age: 'asc' })
          .reorder({ name: 'desc' })
          .toPA()
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
        relation
          .order({ age: 'ASC' })
          .reorder({ name: 'DESC' })
          .toPA()
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
        relation
          .order({ name: 'invalid' })
          .reorder({ name: 'reorder' })
          .toPA()
          .catch((err) => {
            expect(err.toString()).toEqual(
              "Error: Direction 'reorder' is invalid. Valid directions are: '[asc,desc,ASC,DESC]'"
            );
            done();
          });
      });
    });
  });

  describe('#offset', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        relation
          .offset(1)
          .toPA()
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
        relation
          .where({ age: [1, 2] })
          .offset(1)
          .toPA()
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

    describe("when specify 'order' after specify 'offset'", () => {
      it('should correctly', (done) => {
        relation
          .offset(1)
          .order({ age: 'desc' })
          .toPA()
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

  describe('#limit', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        relation
          .limit(1)
          .toPA()
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
            ]);
            done();
          });
      });
    });

    describe("when specify 'where' after specify 'limit'", () => {
      it('should correctly', (done) => {
        relation
          .where({ id: [1, 2] })
          .limit(1)
          .toPA()
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
            ]);
            done();
          });
      });
    });

    describe("when speicfy 'order' after specify 'limit'", () => {
      it('should correctly', (done) => {
        relation
          .order({ age: 'desc' })
          .limit(2)
          .toPA()
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
            ]);
            done();
          });
      });
    });
  });

  describe('#group', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryMethodsRecord.create([{ id: 4, name: 'name_2', age: 2 }]);
        relation
          .group<QueryMethodsRecordParams>('name', 'age')
          .toPA()
          .then((grouped) => {
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
          });
      });
    });
  });

  describe('#reverseOrder', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        relation
          .order({ age: 'desc' })
          .reverseOrder()
          .toPA()
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

    describe("when call 'reverseOrder' only", () => {
      it('should correctly', (done) => {
        relation
          .reverseOrder()
          .toPA()
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
  });

  describe('#unscope', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        relation
          .where({ name: 'name_1' })
          .unscope('where')
          .toPA()
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
        it('should correctly', () => {
          expect(() => {
            relation.unscope();
          }).toThrowError("'unscope()' must contain arguments.");
        });
      });

      describe('when give unsupported arguments', () => {
        it('should correctly', () => {
          expect(() => {
            relation.unscope('unsupported' as any);
          }).toThrowError(
            "Called 'unscope()' with invalid unscoping argument '[unsupported]'. Valid arguments are '[where,order,offset,limit,group]'."
          );
        });
      });
    });
  });
});
