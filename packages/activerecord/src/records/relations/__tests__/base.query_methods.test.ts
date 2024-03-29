import { ActiveRecord$Base as Record } from '@/records';
import {
  ActiveRecord$Relation as Relation,
  ActiveRecord$Relation$Holder as Holder,
} from '@/records/relations';
import { cacheForRecords as RecordCache } from '@/registries';

// thrid party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

const { RECORD_ALL, RUE_AUTO_INCREMENT_RECORD_ID } = Record;

type QueryMethodsRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
  info: {
    github: string;
  };
};

class QueryMethodsRecord extends Record<QueryMethodsRecordParams> {
  public id: QueryMethodsRecordParams['id'];
  public name: QueryMethodsRecordParams['name'];
  public age: QueryMethodsRecordParams['age'];

  protected fetchAll(): Promise<QueryMethodsRecordParams[]> {
    return Promise.resolve([]);
  }

  get uniqueKey(): string {
    return 'QueryMethodsRecord';
  }
}

class QueryMethodsRelation extends Relation<QueryMethodsRecord> {}

describe('ActiveRecord$Relation<T> (QueryMethods)', () => {
  let holder = new Holder(QueryMethodsRecord, []);
  let relation = new QueryMethodsRelation(
    (resolve, _reject) => resolve({ holder, scope: [] })
    // @ts-expect-error
  )._init(QueryMethodsRecord);

  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(async () => {
    MockDate.set('2021-03-05T23:03:21+09:00');
    await relation.create({ id: 1, name: 'name_1', age: 1, info: { github: 'aaa' } });
    await relation.create({ id: 2, name: 'name_2', age: 2, info: { github: 'bbb' } });
    await relation.create({ id: 3, name: 'name_3', age: 3, info: { github: 'ccc' } });
  });

  afterEach(() => {
    MockDate.reset();
    RecordCache.destroy(QueryMethodsRecord.name);

    // Actually, relation is not reused, so this process is not necessary.
    let holder = new Holder(QueryMethodsRecord, []);
    // @ts-expect-error
    relation = new QueryMethodsRelation((resolve, _reject) => resolve({ holder, scope: [] }))._init(
      QueryMethodsRecord
    );
  });

  describe('#where (rewhere)', () => {
    describe("when use 'where' only", () => {
      it('should correctly', (done) => {
        relation
          .where<QueryMethodsRecordParams>({ name: 'name_1' })
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
            ]);
            done();
          });
      });
    });

    describe("when specify 'flatten key'", () => {
      it('should correctly', (done) => {
        relation.where({ 'info.github': 'aaa' }).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              id: 1,
              info: { github: 'aaa' },
              name: 'name_1',
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
        relation.order({ name: 'desc' }).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              info: {
                github: 'ccc',
              },
              name: 'name_3',
              id: 3,
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
              info: {
                github: 'bbb',
              },
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              info: {
                github: 'aaa',
              },
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
        relation.order({ name: 'DESC' }).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              info: {
                github: 'ccc',
              },
              name: 'name_3',
              id: 3,
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
              info: {
                github: 'bbb',
              },
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              info: {
                github: 'aaa',
              },
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
        relation.order({ age: 'asc' }).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              info: {
                github: 'aaa',
              },
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
              info: {
                github: 'bbb',
              },
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              info: {
                github: 'ccc',
              },
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
        relation.order({ age: 'ASC' }).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              info: {
                github: 'aaa',
              },
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
              info: {
                github: 'bbb',
              },
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              info: {
                github: 'ccc',
              },
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
        relation.order({ name: 'invalid' }).rueCatch((err) => {
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                info: {
                  github: 'ccc',
                },
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                info: {
                  github: 'ccc',
                },
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                info: {
                  github: 'ccc',
                },
                name: 'name_3',
                id: 3,
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
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                info: {
                  github: 'ccc',
                },
                name: 'name_3',
                id: 3,
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
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
          .rueCatch((err) => {
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
        relation.offset(1).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              info: {
                github: 'bbb',
              },
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              info: {
                github: 'ccc',
              },
              name: 'name_3',
              id: 3,
            },
          ]);
          done();
        });
      });
    });

    describe('when specify 0', () => {
      it('should return []', (done) => {
        relation.offset(0).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              info: {
                github: 'aaa',
              },
              id: 1,
              name: 'name_1',
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
              info: {
                github: 'bbb',
              },
              id: 2,
              name: 'name_2',
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              info: {
                github: 'ccc',
              },
              id: 3,
              name: 'name_3',
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                info: {
                  github: 'bbb',
                },
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
        relation.limit(1).rueThen((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              info: {
                github: 'aaa',
              },
              name: 'name_1',
              id: 1,
            },
          ]);
          done();
        });
      });
    });

    describe('when specify 0', () => {
      it('should return []', (done) => {
        relation.limit(0).rueThen((records) => {
          expect(records).toEqual([]);
          done();
        });
      });
    });

    describe("when specify 'where' after specify 'limit'", () => {
      it('should correctly', (done) => {
        relation
          .where({ id: [1, 2] })
          .limit(1)
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                info: {
                  github: 'ccc',
                },
                name: 'name_3',
                id: 3,
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
                info: {
                  github: 'bbb',
                },
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
        relation.create({ id: 4, name: 'name_2', age: 2 }).then((_record) => {
          relation.group<QueryMethodsRecordParams>('name', 'age').rueThen((grouped) => {
            expect(grouped).toEqual({
              '[name_1,1]': [
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 1,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _associationCache: {},
                  _destroyed: false,
                  _newRecord: false,
                  age: 1,
                  errors: {},
                  info: {
                    github: 'aaa',
                  },
                  name: 'name_1',
                  id: 1,
                },
              ],
              '[name_2,2]': [
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 2,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _associationCache: {},
                  _destroyed: false,
                  _newRecord: false,
                  age: 2,
                  errors: {},
                  info: {
                    github: 'bbb',
                  },
                  name: 'name_2',
                  id: 2,
                },
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 4,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _associationCache: {},
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
                  _associationCache: {},
                  _destroyed: false,
                  _newRecord: false,
                  age: 3,
                  errors: {},
                  info: {
                    github: 'ccc',
                  },
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
  });

  describe('#reverseOrder', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        relation
          .order({ age: 'desc' })
          .reverseOrder()
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                info: {
                  github: 'ccc',
                },
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
        relation.reverseOrder().then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              info: {
                github: 'aaa',
              },
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
              info: {
                github: 'bbb',
              },
              name: 'name_2',
              id: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              info: {
                github: 'ccc',
              },
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
          .rueThen((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: {},
                info: {
                  github: 'aaa',
                },
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
                info: {
                  github: 'bbb',
                },
                name: 'name_2',
                id: 2,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 3,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _associationCache: {},
                _destroyed: false,
                _newRecord: false,
                age: 3,
                errors: {},
                info: {
                  github: 'ccc',
                },
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
          relation.unscope().rueCatch((err) => {
            expect(err.toString()).toEqual("Error: 'unscope()' must contain arguments.");
            done();
          });
        });
      });

      describe('when give unsupported arguments', () => {
        it('should correctly', (done) => {
          relation.unscope('unsupported' as any).rueCatch((err) => {
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
