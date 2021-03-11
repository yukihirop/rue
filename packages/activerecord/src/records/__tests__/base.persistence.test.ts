import {
  ActiveRecord$Base as Record,
  RUE_AUTO_INCREMENT_RECORD_ID,
  RUE_RECORD_ID,
  RECORD_ALL,
} from '../base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';
import dayjs from 'dayjs';

// types
import type * as at from '@/records/modules/associations';

describe('Record(Persistence)', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#delete', () => {
    type TestDeleteRecordParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestDeleteRecord extends Record<TestDeleteRecordParams> {
      public profile: TestDeleteRecordParams['profile'];

      // The cache is not updated once [static]all is not called
      static fetchAll<T = TestDeleteRecordParams>(): Promise<T[]> {
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
      const record_3 = new TestDeleteRecord({ profile: { name: 'name_3', age: 3 } });
      const record_4 = new TestDeleteRecord({ profile: { name: 'name_4', age: 4 } });

      it('should return destory this', () => {
        record_3.save();
        record_4.save();
        expect(RecordCache.read('TestDeleteRecord', RECORD_ALL)).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            errors: {},
            profile: { age: 3, name: 'name_3' },
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            errors: {},
            profile: { age: 4, name: 'name_4' },
          },
        ]);
        record_4.destroy();
        expect(record_4[RUE_RECORD_ID]).toEqual(2);
        expect(record_4.profile.name).toEqual('name_4');
        expect(record_4.profile.age).toEqual(4);
        expect(record_4.errors).toEqual({});
        expect(RecordCache.read('TestDeleteRecord', RECORD_ALL)).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            errors: {},
            profile: { age: 3, name: 'name_3' },
          },
        ]);
      });
    });
  });

  describe('#isDestroyed', () => {
    type IsDestroyedRecordParams = {
      name: string;
      age: number;
    };

    class IsDestroyedRecord extends Record<IsDestroyedRecordParams> {
      public name: IsDestroyedRecordParams['name'];
      public age: IsDestroyedRecordParams['age'];
    }

    describe('when return false', () => {
      const record = new IsDestroyedRecord({ name: 'name_1', age: 1 });
      expect(record.isDestroyed()).toEqual(false);
    });

    describe('when return true', () => {
      const record = new IsDestroyedRecord({ name: 'name_2', age: 2 });
      record.destroy();
      expect(record.isDestroyed()).toEqual(true);
    });
  });

  describe('#isNewRecord', () => {
    type IsNewRecordRecordParams = {
      name: string;
      age: number;
    };

    class IsNewRecordRecord extends Record<IsNewRecordRecordParams> {
      public name: IsNewRecordRecordParams['name'];
      public age: IsNewRecordRecordParams['age'];
    }

    describe('when return true', () => {
      const record = new IsNewRecordRecord({ name: 'name_1', age: 1 });
      expect(record.isNewRecord()).toEqual(true);
    });

    describe('when return false', () => {
      const record = new IsNewRecordRecord({ name: 'name_2', age: 2 });
      record.save();
      expect(record.isNewRecord()).toEqual(false);
    });
  });

  describe('#isPersisted', () => {
    type IsPersistedRecordParams = {
      name: string;
      age: number;
    };

    class IsPersistedRecord extends Record<IsPersistedRecordParams> {
      public name: IsPersistedRecordParams['name'];
      public age: IsPersistedRecordParams['age'];
    }

    describe('when return true', () => {
      const record = new IsPersistedRecord({ name: 'name_2', age: 2 });
      record.save();
      expect(record.isPersisted()).toEqual(true);
    });

    describe('when return false', () => {
      const record = new IsPersistedRecord({ name: 'name_1', age: 1 });
      expect(record.isPersisted()).toEqual(false);
    });
  });

  describe('#save', () => {
    type TestSaveParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestSaveRecord extends Record<TestSaveParams> {
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
          // Even after saving once, the state does not change no matter how many times you save
          expect(record.save()).toEqual(true);
          expect(record.save()).toEqual(true);
          expect(RecordCache.read('TestSaveSuccessRecord', RUE_AUTO_INCREMENT_RECORD_ID)).toEqual(
            2
          );
          expect(RecordCache.read('TestSaveSuccessRecord', RECORD_ALL)[0].profile.name).toEqual(
            'name_1'
          );
          expect(RecordCache.read('TestSaveSuccessRecord', RECORD_ALL)[0].profile.age).toEqual(20);
          expect(RecordCache.read('TestSaveSuccessRecord', RECORD_ALL)[0].errors).toEqual({
            profile: { name: [], age: [] },
          });
          expect(RecordCache.read('TestSaveSuccessRecord', RECORD_ALL)[0][RUE_RECORD_ID]).toEqual(
            1
          );
        });
      });

      describe('when failure', () => {
        class TestSaveFailureRecord extends TestSaveRecord {}
        // register validations
        TestSaveFailureRecord.validates('profile.name', { absence: true });

        const record = new TestSaveFailureRecord({ profile: { name: 'name_2', age: 30 } });
        it('should retrun false', () => {
          expect(record.save()).toEqual(false);
          expect(RecordCache.data['TestSaveFailureRecord']).toEqual(undefined);
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
    class TestSaveOrThrowRecord extends Record<TestSaveOrThrowParams> {
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
        expect(
          RecordCache.read('TestSaveOrThrowSuccessRecord', RUE_AUTO_INCREMENT_RECORD_ID)
        ).toEqual(2);
        expect(
          RecordCache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0].profile.name
        ).toEqual('name_1');
        expect(RecordCache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0].profile.age).toEqual(
          20
        );
        expect(RecordCache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0].errors).toEqual({
          profile: { name: [], age: [] },
        });
        expect(
          RecordCache.read('TestSaveOrThrowSuccessRecord', RECORD_ALL)[0][RUE_RECORD_ID]
        ).toEqual(1);
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
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "profile": {
      "name": [
        {
          "_namespace": "@rue/activemodel",
          "_code": "PROPERTY IS NOT ABSENCE"
        }
      ]
    }
  },
  "profile": {
    "name": "name_2",
    "age": 30
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
    class TestDestroyRecord extends Record<TestDestroyParams> {
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
        expect(RecordCache.read('TestDestroyRecord', RECORD_ALL)).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            errors: {},
            profile: { age: 3, name: 'name_3' },
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            errors: {},
            profile: { age: 4, name: 'name_4' },
          },
        ]);
        record_4.destroy();
        expect(record_4[RUE_RECORD_ID]).toEqual(2);
        expect(record_4.profile.name).toEqual('name_4');
        expect(record_4.profile.age).toEqual(4);
        expect(record_4.errors).toEqual({});
        expect(RecordCache.read('TestDestroyRecord', RECORD_ALL)).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            errors: {},
            profile: { age: 3, name: 'name_3' },
          },
        ]);
      });
    });
  });

  describe('#isDestroyed', () => {
    type IsDestroyedRecordParams = {
      name: string;
      age: number;
    };

    class IsDestroyedRecord extends Record {
      public name: IsDestroyedRecordParams['name'];
      public age: IsDestroyedRecordParams['age'];
    }

    const createRecord = (params: IsDestroyedRecordParams): IsDestroyedRecord => {
      const record = new IsDestroyedRecord(params);
      record.save();
      return record;
    };

    describe('when return false', () => {
      it('should correctly', () => {
        const record = createRecord({ name: 'name_1', age: 1 });
        expect(record.isDestroyed()).toEqual(false);
      });
    });
  });

  describe('#touch', () => {
    type TouchRecordParams = {
      name: string;
      age: number;
    };

    class TouchRecord extends Record {
      public name: TouchRecordParams['name'];
      public age: TouchRecordParams['age'];
    }

    beforeEach(() => {
      RecordCache.update(TouchRecord.name, RECORD_ALL, []);
    });

    describe('when default', () => {
      it('should correctly', () => {
        const record = new TouchRecord({ name: 'name_1', age: 1 });
        record.save();
        MockDate.set('2021-03-07T15:27:21+09:00');
        expect(record.touch()).toEqual(true);
        expect(record).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-07T15:27:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: {},
          name: 'name_1',
        });
      });
    });

    describe("when specify 'withCreatedAt'", () => {
      it('should correctly', () => {
        const record = new TouchRecord({ name: 'name_1', age: 1 });
        record.save();
        MockDate.set('2021-03-07T15:27:21+09:00');
        expect(record.touch({ withCreatedAt: true })).toEqual(true);
        expect(record).toEqual({
          __rue_created_at__: '2021-03-07T15:27:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-07T15:27:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: {},
          name: 'name_1',
        });
      });
    });

    describe("when specify 'time'", () => {
      it('should correctly', () => {
        const record = new TouchRecord({ name: 'name_1', age: 1 });
        record.save();
        const time = dayjs().format();
        expect(record.touch({ time })).toEqual(true);
        expect(record).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 3,
          __rue_updated_at__: time,
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: {},
          name: 'name_1',
        });
      });
    });
  });

  describe('#update', () => {
    type UpdateRecordParams = {
      name: string;
      age: number;
    };

    class UpdateRecord extends Record<UpdateRecordParams> {
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
          const updateResult = record.update({ name: 'rename' });
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
          const updateResult = record.update({ age: 100 });
          expect(updateResult).toEqual(false);
          expect(record.age).toEqual(2);
          done();
        });
      });
    });
  });

  describe('#updateOrThrow', () => {
    type UpdateOrThrowRecordParams = {
      name: string;
      age: number;
    };

    class UpdateOrThrowRecord extends Record<UpdateOrThrowRecordParams> {
      public name: UpdateOrThrowRecordParams['name'];
      public age: UpdateOrThrowRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }

      static fetchAll<T = UpdateOrThrowRecordParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
        ]);
      }
    }

    UpdateOrThrowRecord.validates('name', { length: { is: 6 } });
    UpdateOrThrowRecord.validates('age', { numericality: { lessThan: 10 } });

    describe('when return true', () => {
      it('should correctly', (done) => {
        UpdateOrThrowRecord.all<UpdateOrThrowRecord>().then((relation) => {
          const records = relation.toA();
          const record = records[0];
          const updateResult = record.updateOrThrow({ name: 'rename' });
          expect(updateResult).toEqual(true);
          expect(record.name).toEqual('rename');
          done();
        });
      });
    });

    describe('when throw error', () => {
      it('should correctly', (done) => {
        UpdateOrThrowRecord.all<UpdateOrThrowRecord>().then((relation) => {
          const records = relation.toA();
          const record = records[1];
          expect(() => {
            record.updateOrThrow({ age: 100 });
          }).toThrowError(`UpdateOrThrowRecord {
  "__rue_created_at__": "2021-03-05T23:03:21+09:00",
  "__rue_record_id__": 2,
  "__rue_updated_at__": "2021-03-05T23:03:21+09:00",
  "_destroyed": false,
  "_newRecord": false,
  "age": 100,
  "errors": {
    "name": [],
    "age": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT LESS THAN NUMERIC"
      }
    ]
  },
  "name": "name_2"
} is invalid.`);
          expect(record.age).toEqual(2);
          done();
        });
      });
    });
  });

  describe('#updateAttribute (alias: updateProperty, updateProp', () => {
    type UpdateAttributeRecordParams = {
      name: string;
      age: number;
    };

    class UpdateAttributeRecord extends Record {
      public name: UpdateAttributeRecordParams['name'];
      public age: UpdateAttributeRecordParams['age'];
    }

    UpdateAttributeRecord.validates('name', { length: { is: 6 } });
    UpdateAttributeRecord.validates('age', { numericality: { lessThan: 10 } });

    beforeEach(() => {
      RecordCache.destroy(UpdateAttributeRecord.name);
    });

    describe('when return true', () => {
      describe('when default', () => {
        it('should correctly', () => {
          const record = new UpdateAttributeRecord({ name: 'name_1', age: 1 });
          record.save();
          expect(record.updateAttribute('name', 'rename')).toEqual(true);
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: { age: [], name: [] },
            name: 'rename',
          });
        });
      });

      describe('when give invalid value (age = 100)', () => {
        it('should correctly', () => {
          const record = new UpdateAttributeRecord({ name: 'name_1', age: 1 });
          record.save();
          expect(record.updateProperty('age', 100)).toEqual(true);
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 100,
            errors: { age: [], name: [] },
            name: 'name_1',
          });
        });
      });

      describe('when given invalid value (name = invalid)', () => {
        it('should correctly', () => {
          const record = new UpdateAttributeRecord({ name: 'name_1', age: 1 });
          record.save();
          expect(record.updateProp('name', 'invalid')).toEqual(true);
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: { age: [], name: [] },
            name: 'invalid',
          });
        });
      });
    });

    describe('when return false', () => {
      describe('when given do not exist attribute', () => {
        it('should correctly', () => {
          const record = new UpdateAttributeRecord({ name: 'name_1', age: 1 });
          record.save();
          expect(record.updateAttribute('doNotExist', 1)).toEqual(false);
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: { age: [], name: [] },
            name: 'name_1',
          });
        });
      });
    });
  });

  describe('[static] create', () => {
    type CreateRecordParams = {
      name: string;
      age: number;
    };

    class CreateRecord extends Record {
      public name: CreateRecordParams['name'];
      public age: CreateRecordParams['age'];
    }

    beforeEach(() => {
      RecordCache.destroy(CreateRecord.name);
    });

    describe('when default', () => {
      it('should correctly', () => {
        const record = CreateRecord.create<CreateRecord, CreateRecordParams>();
        expect(record).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          errors: {},
        });
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', () => {
        const record = CreateRecord.create<CreateRecord, CreateRecordParams>({
          name: 'name_1',
          age: 1,
        });
        expect(record).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: {},
          name: 'name_1',
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', () => {
        const records = CreateRecord.create<CreateRecord, CreateRecordParams>([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
        ]) as CreateRecord[];
        expect(records.length).toEqual(2);
        expect(records[0]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: {},
          name: 'name_1',
        });
        expect(records[1]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 2,
          errors: {},
          name: 'name_2',
        });
      });
    });

    describe("when specify 'yielder'", () => {
      it('should correctly', () => {
        const records = CreateRecord.create<CreateRecord, CreateRecordParams>(
          [{ name: 'name_1' }, { name: 'name_2' }],
          (self) => {
            self.age = 3;
          }
        ) as CreateRecord[];
        expect(records.length).toEqual(2);
        expect(records).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 3,
            errors: {},
            name: 'name_1',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 3,
            errors: {},
            name: 'name_2',
          },
        ]);
      });
    });
  });

  describe('[static] createOrThrow', () => {
    type CreateOrThrowRecordParams = {
      name: string;
      age: number;
    };

    class CreateOrThrowRecord extends Record {
      public name: CreateOrThrowRecordParams['name'];
      public age: CreateOrThrowRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    CreateOrThrowRecord.validates('name', { length: { is: 6 } });
    CreateOrThrowRecord.validates('age', { numericality: { lessThan: 10 } });

    beforeEach(() => {
      RecordCache.destroy(CreateOrThrowRecord.name);
    });

    describe('when default', () => {
      it('should correctly', () => {
        const record = CreateOrThrowRecord.createOrThrow<
          CreateOrThrowRecord,
          CreateOrThrowRecordParams
        >({ name: 'name_1', age: 1 });
        expect(record).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: { name: [], age: [] },
          name: 'name_1',
        });
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', () => {
        const record = CreateOrThrowRecord.createOrThrow<
          CreateOrThrowRecord,
          CreateOrThrowRecordParams
        >({
          name: 'name_1',
          age: 1,
        });
        expect(record).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: { name: [], age: [] },
          name: 'name_1',
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', () => {
        const records = CreateOrThrowRecord.createOrThrow<
          CreateOrThrowRecord,
          CreateOrThrowRecordParams
        >([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
        ]) as CreateOrThrowRecord[];
        expect(records.length).toEqual(2);
        expect(records).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: { name: [], age: [] },
            name: 'name_1',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 2,
            errors: { name: [], age: [] },
            name: 'name_2',
          },
        ]);
      });
    });

    describe("when specify 'yielder'", () => {
      it('should correctly', () => {
        const records = CreateOrThrowRecord.createOrThrow<
          CreateOrThrowRecord,
          CreateOrThrowRecordParams
        >(
          [
            { name: 'name_1', age: 1 },
            { name: 'name_2', age: 2 },
          ],
          (self) => {
            self.age = 3;
          }
        ) as CreateOrThrowRecord[];
        expect(records.length).toEqual(2);
        expect(records).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 3,
            errors: { name: [], age: [] },
            name: 'name_1',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 3,
            errors: { name: [], age: [] },
            name: 'name_2',
          },
        ]);
      });
    });

    describe('when throw error', () => {
      it('should correctly', () => {
        expect(() => {
          CreateOrThrowRecord.createOrThrow<CreateOrThrowRecord, CreateOrThrowRecordParams>([
            { name: 'name_1', age: 100 },
            { name: 'name_2', age: 2 },
          ]) as CreateOrThrowRecord[];
        }).toThrowError(`CreateOrThrowRecord {
  "_destroyed": false,
  "_newRecord": true,
  "age": 100,
  "errors": {
    "name": [],
    "age": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT LESS THAN NUMERIC"
      }
    ]
  },
  "name": "name_1"
} is invalid.`);
      });
    });
  });

  describe('[static] delete', () => {
    type DeleteRecordParams = {
      id: at.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class DeleteRecord extends Record {
      public id: at.Associations$PrimaryKey;
      public name: DeleteRecordParams['name'];
      public age: DeleteRecordParams['age'];

      protected static fetchAll<T = DeleteRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    beforeEach(() => {
      RecordCache.destroy(DeleteRecord.name);
    });

    describe('when default', () => {
      it('should correctly', () => {
        DeleteRecord.create([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
        expect(RecordCache.data[DeleteRecord.name][RECORD_ALL].length).toEqual(2);
        expect(DeleteRecord.delete(1)).toEqual(1);
        expect(RecordCache.data[DeleteRecord.name][RECORD_ALL].length).toEqual(1);
      });
    });

    describe("when specify 'array of id'", () => {
      it('should correctly', () => {
        DeleteRecord.create([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
        expect(RecordCache.data[DeleteRecord.name][RECORD_ALL].length).toEqual(2);
        expect(DeleteRecord.delete([1, 2])).toEqual(2);
        expect(RecordCache.data[DeleteRecord.name][RECORD_ALL].length).toEqual(0);
      });
    });
  });

  describe('[static] destroy', () => {
    type DestroyRecordParams = {
      name: string;
      age: number;
    };

    class DestroyRecord extends Record {
      public name: DestroyRecordParams['name'];
      public age: DestroyRecordParams['age'];
    }

    beforeEach(() => {
      RecordCache.destroy(DestroyRecord.name);
    });

    describe('when default', () => {
      it('should correctly', () => {
        DestroyRecord.create([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
        expect(RecordCache.data[DestroyRecord.name][RECORD_ALL].length).toEqual(2);
        expect(DestroyRecord.destroy(1)).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: true,
          _newRecord: false,
          age: 1,
          errors: {},
          name: 'name_1',
          id: 1,
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', () => {
        DestroyRecord.create([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
        expect(RecordCache.data[DestroyRecord.name][RECORD_ALL].length).toEqual(2);
        expect(DestroyRecord.destroy([1, 2])).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: true,
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
            _destroyed: true,
            _newRecord: false,
            age: 2,
            errors: {},
            name: 'name_2',
            id: 2,
          },
        ]);
      });
    });

    describe('when throw error when params is not array', () => {
      it('should correctly', () => {
        DestroyRecord.create([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
        expect(RecordCache.data[DestroyRecord.name][RECORD_ALL].length).toEqual(2);
        expect(() => {
          DestroyRecord.destroy(3);
        }).toThrowError("Couldn't find 'DestroyRecord' with 'id' = '3'");
      });
    });

    describe('when throw error when params is array', () => {
      it('should correctly', () => {
        DestroyRecord.create([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
        expect(RecordCache.data[DestroyRecord.name][RECORD_ALL].length).toEqual(2);
        expect(() => {
          DestroyRecord.destroy([3, 4]);
        }).toThrowError(
          "Could't find all 'DestroyRecord' with 'id': [3,4] (found 0 results, but was looking for 2)"
        );
      });
    });
  });

  describe('[static] update', () => {
    type StaticUpdateRecordParams = {
      id: at.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class StaticUpdateRecord extends Record {
      public id: at.Associations$PrimaryKey;
      public name: StaticUpdateRecordParams['name'];
      public age: StaticUpdateRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    StaticUpdateRecord.validates('name', { length: { maximum: 10 } });
    StaticUpdateRecord.validates('age', { numericality: { lessThan: 10 } });

    beforeEach(() => {
      RecordCache.destroy(StaticUpdateRecord.name);
      StaticUpdateRecord.create([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
      ]);
    });

    describe("when give 'id = all'", () => {
      it('should correctly', () => {
        const updatedRecord = StaticUpdateRecord.update<
          StaticUpdateRecord,
          StaticUpdateRecordParams
        >('all', {
          name: 'rename',
        });
        expect(updatedRecord).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: { age: [], name: [] },
            name: 'rename',
            id: 1,
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 2,
            errors: { age: [], name: [] },
            name: 'rename',
            id: 2,
          },
        ]);
      });
    });

    describe("when give 'id'", () => {
      it('should correctly', () => {
        const updatedRecord = StaticUpdateRecord.update<
          StaticUpdateRecord,
          StaticUpdateRecordParams
        >(1, {
          name: 'rename',
        });
        expect(updatedRecord).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          age: 1,
          errors: { age: [], name: [] },
          name: 'rename',
          id: 1,
        });
      });
    });

    describe("when given 'array of id'", () => {
      it('should correctly', () => {
        const updatedRecords = StaticUpdateRecord.update<
          StaticUpdateRecord,
          StaticUpdateRecordParams
        >([1, 2], [{ name: 'rename_1' }, { name: 'rename_2' }]) as StaticUpdateRecord[];
        expect(updatedRecords.length).toEqual(2);
        expect(updatedRecords).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: { age: [], name: [] },
            name: 'rename_1',
            id: 1,
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 2,
            errors: { age: [], name: [] },
            name: 'rename_2',
            id: 2,
          },
        ]);
      });

      it('validation is skipped. The errors of the record to be updated are set and it returns as it is', () => {
        const updatedRecords = StaticUpdateRecord.update<
          StaticUpdateRecord,
          StaticUpdateRecordParams
        >([1, 2], [{ name: 'invalid_name_1' }, { name: 'invalid_name_2' }]) as StaticUpdateRecord[];
        expect(updatedRecords.length).toEqual(2);
        expect(updatedRecords).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {
              age: [],
              name: [
                new Error(
                  "'rue.records.StaticUpdateRecord.name' is too long (maximum '10' characters)."
                ),
              ],
            },
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
            errors: {
              age: [],
              name: [
                new Error(
                  "'rue.records.StaticUpdateRecord.name' is too long (maximum '10' characters)."
                ),
              ],
            },
            name: 'name_2',
            id: 2,
          },
        ]);
      });
    });

    describe('when throw error', () => {
      describe("when can't find record when specify 'id'", () => {
        it('should correctly', () => {
          expect(() => {
            StaticUpdateRecord.update<StaticUpdateRecord, StaticUpdateRecordParams>(3, {
              name: 'rename_3',
            });
          }).toThrowError("Couldn't find 'StaticUpdateRecord' with 'id' = '3'");
        });
      });

      describe("when can't find records when specify 'array of id'", () => {
        it('should correctly', () => {
          expect(() => {
            StaticUpdateRecord.update<StaticUpdateRecord, StaticUpdateRecordParams>(
              [3, 4],
              [
                {
                  name: 'rename_3',
                },
                {
                  name: 'rename_4',
                },
              ]
            );
          }).toThrowError("Couldn't find 'StaticUpdateRecord' with 'id' = '3'");
        });
      });
    });
  });
});
