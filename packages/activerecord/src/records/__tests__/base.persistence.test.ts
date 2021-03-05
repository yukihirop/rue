import {
  ActiveRecord$Base as Record,
  RECORD_AUTO_INCREMENNT_ID,
  RECORD_ID,
  RECORD_ALL,
} from '../base';
import { cacheForRecords as Cache } from '@/registries';
import MockDate from 'mockdate';

describe('Record(Persistence)', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeAll(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterAll(() => {
    MockDate.reset();
  });

  describe('#save', () => {
    type TestSaveParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestSaveRecord extends Record {
      public profile: TestSaveParams['profile'];

      // The cache is not updated once [static]all is not called
      static fetchAll<T = TestSaveParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { profile: { name: 'name_1', age: 1 } },
          { profile: { name: 'name_2', age: 2 } },
        ]);
      }

      // override
      static translate(key: string, opts?: any): string {
        return `test.${key}`;
      }
    }

    describe('when default', () => {
      describe('when success', () => {
        class TestSaveSuccessRecord extends TestSaveRecord {}
        // register validations
        TestSaveSuccessRecord.validates('profile.name', { presence: true });
        TestSaveSuccessRecord.validates('profile.age', { numericality: { onlyInteger: true } });

        const record = new TestSaveSuccessRecord({ profile: { name: 'name_1', age: 20 } });
        it('should return true', () => {
          expect(record.save()).toEqual(true);
          expect(Cache.read('TestSaveSuccessRecord', RECORD_AUTO_INCREMENNT_ID)).toEqual(2);
          expect(Cache.read('TestSaveSuccessRecord', RECORD_ALL)[0].profile.name).toEqual('name_1');
          expect(Cache.read('TestSaveSuccessRecord', RECORD_ALL)[0].profile.age).toEqual(20);
          expect(Cache.read('TestSaveSuccessRecord', RECORD_ALL)[0].errors).toEqual({
            profile: { name: [], age: [] },
          });
          expect(Cache.read('TestSaveSuccessRecord', RECORD_ALL)[0][RECORD_ID]).toEqual(1);
        });
      });

      describe('when failure', () => {
        class TestSaveFailureRecord extends TestSaveRecord {}
        // register validations
        TestSaveFailureRecord.validates('profile.name', { absence: true });

        const record = new TestSaveFailureRecord({ profile: { name: 'name_2', age: 30 } });
        it('should retrun false', () => {
          expect(record.save()).toEqual(false);
          expect(Cache.data['TestSaveFailureRecord']).toEqual(undefined);
        });
      });
    });
  });

  describe('#saveOrThrow', () => {
    type TestSaveOrThrowParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestSaveOrThrowRecord extends Record {
      public profile: TestSaveOrThrowParams['profile'];

      // The cache is not updated once [static]all is not called
      static fetchAll<T = TestSaveOrThrowParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { profile: { name: 'name_1', age: 1 } },
          { profile: { name: 'name_2', age: 2 } },
        ]);
      }

      // override
      static translate(key: string, opts?: any): string {
        return `test.${key}`;
      }
    }

    describe('when success', () => {
      class TestSaveOrThrowSuccessRecord extends TestSaveOrThrowRecord {}
      // register validations
      TestSaveOrThrowSuccessRecord.validates('profile.name', { presence: true });
      TestSaveOrThrowSuccessRecord.validates('profile.age', {
        numericality: { onlyInteger: true },
      });

      const record = new TestSaveOrThrowSuccessRecord({ profile: { name: 'name_1', age: 20 } });
      it('should return true', () => {
        expect(record.save()).toEqual(true);
        expect(Cache.read('TestSaveOrThrowSuccessRecord', RECORD_AUTO_INCREMENNT_ID)).toEqual(2);
        expect(Cache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0].profile.name).toEqual(
          'name_1'
        );
        expect(Cache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0].profile.age).toEqual(20);
        expect(Cache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0].errors).toEqual({
          profile: { name: [], age: [] },
        });
        expect(Cache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0][RECORD_ID]).toEqual(1);
      });
    });

    describe('when throw error', () => {
      class TestSaveOrThrowFailureRecord extends TestSaveOrThrowRecord {}
      // register validations
      TestSaveOrThrowFailureRecord.validates('profile.name', { absence: true });

      const record = new TestSaveOrThrowFailureRecord({ profile: { name: 'name_2', age: 30 } });
      it('should throw error', () => {
        expect(() => {
          record.saveOrThrow();
        }).toThrowError(
          `TestSaveOrThrowFailureRecord {
  \"errors\": {
    \"profile\": {
      \"name\": [
        {
          \"_namespace\": \"@rue/activemodel\",
          \"_code\": \"PROPERTY IS NOT ABSENCE\"
        }
      ]
    }
  },
  \"profile\": {
    \"name\": \"name_2\",
    \"age\": 30
  }
} is invalid.`
        );
      });
    });
  });

  describe('#destroy', () => {
    type TestDestroyParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestDestroyRecord extends Record {
      public profile: TestDestroyParams['profile'];

      // The cache is not updated once [static]all is not called
      static fetchAll<T = TestDestroyParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { profile: { name: 'name_1', age: 1 } },
          { profile: { name: 'name_2', age: 2 } },
        ]);
      }

      // override
      static translate(key: string, opts?: any): string {
        return `test.${key}`;
      }
    }

    describe('when default', () => {
      const record_3 = new TestDestroyRecord({ profile: { name: 'name_3', age: 3 } });
      const record_4 = new TestDestroyRecord({ profile: { name: 'name_4', age: 4 } });

      it('should return destory this', () => {
        record_3.save();
        record_4.save();
        expect(Cache.read('TestDestroyRecord', RECORD_ALL)).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            errors: {},
            profile: { age: 3, name: 'name_3' },
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            errors: {},
            profile: { age: 4, name: 'name_4' },
          },
        ]);
        record_4.destroy();
        expect(record_4[RECORD_ID]).toEqual(2);
        expect(record_4.profile.name).toEqual('name_4');
        expect(record_4.profile.age).toEqual(4);
        expect(record_4.errors).toEqual({});
        expect(Cache.read('TestDestroyRecord', RECORD_ALL)).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            errors: {},
            profile: { age: 3, name: 'name_3' },
          },
        ]);
      });
    });
  });

  describe('#update', () => {
    type UpdateRecordParams = {
      name: string;
      age: number;
    };

    class UpdateRecord extends Record {
      public name: UpdateRecordParams['name'];
      public age: UpdateRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }

      static fetchAll<T = UpdateRecordParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
        ]);
      }
    }

    UpdateRecord.validates('name', { length: { is: 6 } });
    UpdateRecord.validates('age', { numericality: { lessThan: 10 } });

    describe('when return true', () => {
      it('should correctly', (done) => {
        UpdateRecord.all<UpdateRecord>().then((relation) => {
          const records = relation.toA();
          const record = records[0];
          const updateResult = record.update<UpdateRecordParams>({ name: 'rename' });
          expect(updateResult).toEqual(true);
          expect(record.name).toEqual('rename');
          done();
        });
      });
    });

    describe('whenn return false', () => {
      it('should correctly', (done) => {
        UpdateRecord.all<UpdateRecord>().then((relation) => {
          const records = relation.toA();
          const record = records[1];
          const updateResult = record.update<UpdateRecordParams>({ age: 100 });
          expect(updateResult).toEqual(false);
          expect(record.age).toEqual(2);
          done();
        });
      });
    });
  });

  describe('[static] destroyAll', () => {
    type TestDestroyAllParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestDestroyAllRecord extends Record {
      public profile: TestDestroyAllParams['profile'];

      // The cache is not updated once [static]all is not called
      static fetchAll<T = TestDestroyAllParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { profile: { name: 'name_1', age: 1 } },
          { profile: { name: 'name_2', age: 2 } },
        ]);
      }

      // override
      static translate(key: string, opts?: any): string {
        return `test.${key}`;
      }
    }

    describe('when default', () => {
      class TestDestroyAllDefaultRecord extends TestDestroyAllRecord {}
      it('should return delete data all', (done) => {
        TestDestroyAllDefaultRecord.all<TestDestroyAllDefaultRecord>().then((relation) => {
          const records = relation.toA();
          expect(records[0].profile.name).toEqual('name_1');
          expect(records[0].profile.age).toEqual(1);
          expect(records[1].profile.name).toEqual('name_2');
          expect(records[1].profile.age).toEqual(2);
          expect(TestDestroyAllDefaultRecord.destroyAll()).toEqual(records);
          expect(Cache.read('TestDestroyAllDefaultRecord', RECORD_ALL)).toEqual([]);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      class TestDestroyAllFilterRecord extends TestDestroyAllRecord {}
      it('should return filtered data all', (done) => {
        TestDestroyAllFilterRecord.all<TestDestroyAllFilterRecord>().then((relation) => {
          const records = relation.toA();
          expect(records[0].profile.name).toEqual('name_1');
          expect(records[0].profile.age).toEqual(1);
          expect(records[1].profile.name).toEqual('name_2');
          expect(records[1].profile.age).toEqual(2);
          expect(
            TestDestroyAllFilterRecord.destroyAll<TestDestroyAllFilterRecord>(
              (self) => self.profile.name == 'name_1'
            )
          ).toEqual([records[0]]);
          expect(Cache.read('TestDestroyAllFilterRecord', RECORD_ALL)).toEqual([records[1]]);
          done();
        });
      });
    });
  });
});
