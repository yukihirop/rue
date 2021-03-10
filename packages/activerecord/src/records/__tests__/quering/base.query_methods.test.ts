import { ActiveRecord$Base as Record } from '@/records';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';

// types
import type * as at from '@/records/modules/associations';

const { RUE_AUTO_INCREMENT_RECORD_ID, RECORD_ALL } = Record;

type QueryingRecordParams = {
  primaryKey: at.Associations$PrimaryKey;
  name: string;
  age: number;
};

class QueryingRecord extends Record {
  public primaryKey: QueryingRecordParams['primaryKey'];
  public name: QueryingRecordParams['name'];
  public age: QueryingRecordParams['age'];

  protected static fetchAll<T = QueryingRecordParams>(): Promise<T[]> {
    return Promise.resolve([]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }
}

describe('ActiveRecord$Base (Querying) (delegate to QueryMethods)', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
    QueryingRecord.create([
      { primaryKey: 1, name: 'name_1', age: 1 },
      { primaryKey: 2, name: 'name_2', age: 2 },
      { primaryKey: 3, name: 'name_3', age: 3 },
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
        QueryingRecord.where<QueryingRecord, QueryingRecordParams>({ name: 'name_1' }).then(
          (relation) => {
            const records = relation.toA();
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
                primaryKey: 1,
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
        QueryingRecord.where<QueryingRecord, QueryingRecordParams>({ name: 'name_1' }).then(
          (relation) => {
            relation
              .where<QueryingRecordParams>({ age: 1 })
              .rewhere<QueryingRecordParams>({ name: 'name_2' })
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
                    primaryKey: 2,
                  },
                ]);
                done();
              });
          }
        );
      });
    });
  });

  describe('[static] order', () => {
    describe("when specify 'name: 'desc''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'desc' }).then((relation) => {
          const records = relation.toA();
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
              primaryKey: 3,
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
              primaryKey: 2,
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
              primaryKey: 1,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'name: 'DESC''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'DESC' }).then((relation) => {
          const records = relation.toA();
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
              primaryKey: 3,
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
              primaryKey: 2,
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
              primaryKey: 1,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'name: 'asc''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'asc' }).then((relation) => {
          const records = relation.toA();
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
              primaryKey: 1,
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
              primaryKey: 2,
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
              primaryKey: 3,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'name: 'ASC''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'ASC' }).then((relation) => {
          const records = relation.toA();
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
              primaryKey: 1,
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
              primaryKey: 2,
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
              primaryKey: 3,
            },
          ]);
          done();
        });
      });
    });

    describe('when invalid direction', () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'invalid' })
          .then((r) => r.toA())
          .catch((err) => {
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
        QueryingRecord.order({ name: 'desc' }).then((relation) => {
          relation
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
                  primaryKey: 1,
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
                  primaryKey: 2,
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
                  primaryKey: 3,
                },
              ]);
              done();
            });
        });
      });
    });

    describe("when specify 'age: 'ASC''", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'DESC' }).then((relation) => {
          relation
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
                  primaryKey: 1,
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
                  primaryKey: 2,
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
                  primaryKey: 3,
                },
              ]);
              done();
            });
        });
      });
    });
  });

  describe("when specify 'name: 'desc''", () => {
    it('should correctly', (done) => {
      QueryingRecord.order({ age: 'asc' }).then((relation) => {
        relation
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
                primaryKey: 3,
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
                primaryKey: 2,
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
                primaryKey: 1,
              },
            ]);
            done();
          });
      });
    });
  });

  describe("when specify 'name: 'DESC''", () => {
    it('should correctly', (done) => {
      QueryingRecord.order({ age: 'ASC' }).then((relation) => {
        relation
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
                primaryKey: 3,
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
                primaryKey: 2,
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
                primaryKey: 1,
              },
            ]);
            done();
          });
      });
    });

    describe('when invalid direction', () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ name: 'invalid' }).then((relation) => {
          relation
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
  });

  describe('[static] offset', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.offset(1).then((relation) => {
          const records = relation.toA();
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
              primaryKey: 2,
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
              primaryKey: 3,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'offset' after specify 'where'", () => {
      it('should correctly', (done) => {
        QueryingRecord.where({ age: [1, 2] }).then((relation) => {
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
                  primaryKey: 2,
                },
              ]);
              done();
            });
        });
      });
    });

    describe("when specify 'order' after specify 'offset'", () => {
      it('should correctly', (done) => {
        QueryingRecord.offset(1).then((relation) => {
          relation
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
                  primaryKey: 2,
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
                  primaryKey: 1,
                },
              ]);
              done();
            });
        });
      });
    });
  });

  describe('[static] limit', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.limit(1).then((relation) => {
          relation.toPA().then((records) => {
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
                primaryKey: 1,
              },
            ]);
            done();
          });
        });
      });
    });

    describe("when specify 'where' after specify 'limit'", () => {
      it('should correctly', (done) => {
        QueryingRecord.where({ primaryKey: [1, 2] }).then((relation) => {
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
                  primaryKey: 1,
                },
              ]);
              done();
            });
        });
      });
    });

    describe("when speicfy 'order' after specify 'limit'", () => {
      it('should correctly', (done) => {
        QueryingRecord.order({ age: 'desc' }).then((relation) => {
          relation
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
                  primaryKey: 3,
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
                  primaryKey: 2,
                },
              ]);
              done();
            });
        });
      });
    });
  });

  describe('[static] group', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.create([{ primaryKey: 4, name: 'name_2', age: 2 }]);
        QueryingRecord.group<QueryingRecord, QueryingRecordParams>('name', 'age').then(
          (relation) => {
            relation.toPA().then((grouped) => {
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
                    primaryKey: 1,
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
                    primaryKey: 2,
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
                    primaryKey: 4,
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
                    primaryKey: 3,
                  },
                ],
              });
              done();
            });
          }
        );
      });
    });
  });

  describe('[static] unscope', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.where({ name: 'name_1' }).then((relation) => {
          relation
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
                  primaryKey: 1,
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
                  primaryKey: 2,
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
                  primaryKey: 3,
                },
              ]);
              done();
            });
        });
      });
    });

    describe('when throw errors', () => {
      describe('when do not give arguments', () => {
        it('should correctly', (done) => {
          // Evaluate by calling relation.toA ()
          QueryingRecord.unscope()
            .then((r) => r.toA())
            .catch((err) => {
              expect(err.toString()).toEqual("Error: 'unscope()' must contain arguments.");
              done();
            });
        });
      });

      describe('when give unsupported arguments', () => {
        it('should correctly', (done) => {
          // Evaluate by calling relation.toA ()
          QueryingRecord.unscope('unsupported' as any)
            .then((r) => r.toA())
            .catch((err) => {
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
