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

  describe('[static] where', () => {
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

    describe('when do not exists cahce', () => {
      it('should correctly', (done) => {
        TestWhereRecord.where<TestWhereRecord>({ name: 'name_1' }).then((records) => {
          expect(records.length).toEqual(1);
          expect(records[0].name).toEqual('name_1');
          expect(records[0].age).toEqual(1);
          expect(Cache.read<TestWhereRecord[]>('TestWhereRecord', RECORD_ALL).length).toEqual(2);
          expect(Cache.read('TestWhereRecord', RECORD_ALL)[0].name).toEqual('name_1');
          expect(Cache.read('TestWhereRecord', RECORD_ALL)[0].age).toEqual(1);
          expect(Cache.read('TestWhereRecord', RECORD_ALL)[0].errors).toEqual({});
          expect(Cache.read('TestWhereRecord', RECORD_ALL)[0][RECORD_ID]).toEqual(1);
          expect(Cache.read('TestWhereRecord', RECORD_AUTO_INCREMENNT_ID)).toEqual(3);
          done();
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

  describe('#inspect', () => {
    type TestInspectParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestInspectRecord extends Record {
      public profile: TestInspectParams['profile'];

      // The cache is not updated once [static]all is not called
      static fetchAll<T = TestInspectParams>(): Promise<T[]> {
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
      const record = new TestInspectRecord({ profile: { name: 'name_3', age: 30 } });
      it('should correctly', () => {
        record.save();
        const expected = `TestInspectRecord {
  "__rue_record_id__": 1,
  "errors": {},
  "profile": {
    "name": "name_3",
    "age": 30
  }
}`;
        expect(record.inspect()).toEqual(expected);
      });
    });
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
          { __rue_record_id__: 1, errors: {}, profile: { age: 3, name: 'name_3' } },
          { __rue_record_id__: 2, errors: {}, profile: { age: 4, name: 'name_4' } },
        ]);
        record_4.destroy();
        expect(record_4[RECORD_ID]).toEqual(2);
        expect(record_4.profile.name).toEqual('name_4');
        expect(record_4.profile.age).toEqual(4);
        expect(record_4.errors).toEqual({});
        expect(Cache.read('TestDestroyRecord', RECORD_ALL)).toEqual([
          { __rue_record_id__: 1, errors: {}, profile: { age: 3, name: 'name_3' } },
        ]);
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
        TestDestroyAllDefaultRecord.all<TestDestroyAllDefaultRecord>().then((records) => {
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
        TestDestroyAllFilterRecord.all<TestDestroyAllFilterRecord>().then((records) => {
          expect(records[0].profile.name).toEqual('name_1');
          expect(records[0].profile.age).toEqual(1);
          expect(records[1].profile.name).toEqual('name_2');
          expect(records[1].profile.age).toEqual(2);
          expect(
            TestDestroyAllFilterRecord.destroyAll((self) => self.profile.name == 'name_1')
          ).toEqual([records[0]]);
          expect(Cache.read('TestDestroyAllFilterRecord', RECORD_ALL)).toEqual([records[1]]);
          done();
        });
      });
    });
  });
});
