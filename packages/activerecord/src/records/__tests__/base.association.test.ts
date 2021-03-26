// locals
import { ActiveRecord$Base as Record } from '../base';

// thrid party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

describe('ActiveRecord$Base (ActiveRecord$Associations)', () => {
  beforeEach(async () => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('[static] belongsTo', () => {
    type TestAssociationBelongsToParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationBelongsToChildParams = {
      id: t.Record$PrimaryKey;
      foreignKey: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationBelongsToRecord extends Record {
      public id: TestAssociationBelongsToParams['id'];
      public name: TestAssociationBelongsToParams['name'];
      public age: TestAssociationBelongsToParams['age'];

      protected fetchAll(): Promise<TestAssociationBelongsToParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationBelongsToChildRecord extends Record {
      public id: TestAssociationBelongsToChildParams['id'];
      public foreignKey: TestAssociationBelongsToChildParams['foreignKey'];
      public childName: TestAssociationBelongsToChildParams['childName'];
      public childAge: TestAssociationBelongsToChildParams['childAge'];
      public parent: t.Record$BelongsTo<TestAssociationBelongsToRecord>;

      protected fetchAll(): Promise<TestAssociationBelongsToChildParams[]> {
        return Promise.resolve([
          { id: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, foreignKey: 1, childName: 'child_name_21', childAge: 21 },
          { id: 3, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
          { id: 4, foreignKey: 2, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationBelongsToChildRecord.belongsTo('parent', {
      klass: TestAssociationBelongsToRecord,
      foreignKey: 'foreignKey',
    });

    it('should correctly', (done) => {
      TestAssociationBelongsToChildRecord.all<TestAssociationBelongsToChildRecord>().then(
        (records) => {
          const record = records[0];
          expect(record.id).toEqual(1);
          expect(record.foreignKey).toEqual(1);
          expect(record.childName).toEqual('child_name_11');
          expect(record.childAge).toEqual(11);

          record.parent().then((record) => {
            expect(record.id).toEqual(1);
            expect(record.name).toEqual('name_1');
            expect(record.age).toEqual(1);
            done();
          });
        }
      );
    });
  });

  describe('[static] hasOne', () => {
    type TestAssociationHasOneParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasOneChildParams = {
      id: t.Record$PrimaryKey;
      foreignKey: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasOneRecord extends Record {
      public id: TestAssociationHasOneParams['id'];
      public name: TestAssociationHasOneParams['name'];
      public age: TestAssociationHasOneParams['age'];
      public child: t.Record$HasOne<TestAssociationHasOneChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasOneParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasOneChildRecord extends Record {
      public id: TestAssociationHasOneChildParams['id'];
      public foreignKey: TestAssociationHasOneChildParams['foreignKey'];
      public childName: TestAssociationHasOneChildParams['childName'];
      public childAge: TestAssociationHasOneChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasOneChildParams[]> {
        return Promise.resolve([
          { id: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
        ]);
      }
    }

    // register relations
    TestAssociationHasOneRecord.hasOne('child', {
      klass: TestAssociationHasOneChildRecord,
      foreignKey: 'foreignKey',
    });

    it('should correctly', (done) => {
      TestAssociationHasOneRecord.all<TestAssociationHasOneRecord>().then((records) => {
        const record = records[0];
        expect(record.id).toEqual(1);
        expect(record.name).toEqual('name_1');
        expect(record.age).toEqual(1);

        record.child().then((record) => {
          expect(record.id).toEqual(1);
          expect(record.foreignKey).toEqual(1);
          expect(record.childName).toEqual('child_name_11');
          expect(record.childAge).toEqual(11);
          done();
        });
      });
    });

    describe("[static] hasOne (specify 'through')", () => {
      type TestAssociationHasOneThroughParams = {
        id: t.Record$PrimaryKey;
        name: String;
        age: number;
      };

      type TestAssociationHasOneThroughThroughParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        oneId: t.Record$ForeignKey;
      };

      type TestAssociationHasOneThroughOneParams = {
        id: t.Record$PrimaryKey;
        oneName: String;
        oneAge: number;
      };

      class TestAssociationHasOneThroughRecord extends Record<TestAssociationHasOneThroughParams> {
        public id: TestAssociationHasOneThroughParams['id'];
        public name: TestAssociationHasOneThroughParams['name'];
        public age: TestAssociationHasOneThroughParams['age'];
        public one: t.Record$HasOne<TestAssociationHasOneThroughOneRecord>;

        protected fetchAll(): Promise<TestAssociationHasOneThroughParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
          ]);
        }
      }

      class TestAssociationHasOneThroughThroughRecord extends Record<TestAssociationHasOneThroughThroughParams> {
        public id: TestAssociationHasOneThroughThroughParams['id'];
        public parentId: TestAssociationHasOneThroughThroughParams['parentId'];
        public oneId: TestAssociationHasOneThroughThroughParams['oneId'];

        protected fetchAll(): Promise<TestAssociationHasOneThroughThroughParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, oneId: 1 },
            { id: 2, parentId: 1, oneId: 2 },
          ]);
        }
      }

      class TestAssociationHasOneThroughOneRecord extends Record<TestAssociationHasOneThroughOneParams> {
        public id: TestAssociationHasOneThroughOneParams['id'];
        public oneName: TestAssociationHasOneThroughOneParams['oneName'];
        public oneAge: TestAssociationHasOneThroughOneParams['oneAge'];

        protected fetchAll(): Promise<TestAssociationHasOneThroughOneParams[]> {
          return Promise.resolve([
            { id: 1, oneName: 'one_name_11', oneAge: 11 },
            { id: 2, oneName: 'one_name_21', oneAge: 21 },
            { id: 3, oneName: 'one_name_22', oneAge: 22 },
            { id: 4, oneName: 'one_name_42', oneAge: 42 },
          ]);
        }
      }

      // register relations
      TestAssociationHasOneThroughRecord.hasOne<
        TestAssociationHasOneThroughOneRecord,
        TestAssociationHasOneThroughThroughRecord
      >('one', {
        klass: TestAssociationHasOneThroughOneRecord,
        /**
         * @description If you specify `through`, the `foreignKey` option is ignored.
         */
        foreignKey: 'ignoredId',
        through: {
          klass: TestAssociationHasOneThroughThroughRecord,
          foreignKey: 'parentId',
          associationForeignKey: 'oneId',
        },
      });

      it('should correctly', async () => {
        const record = (await TestAssociationHasOneThroughRecord.first<TestAssociationHasOneThroughRecord>()) as TestAssociationHasOneThroughRecord;
        const result = await record.one();
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          errors: {},
          id: 1,
          oneAge: 11,
          oneName: 'one_name_11',
        });
      });
    });

    describe("when hasOne (specify 'scope')", () => {
      type TestAssociationHasOneScopeParams = {
        id: t.Record$PrimaryKey;
        name: String;
        age: number;
      };

      type TestAssociationHasOneScopeChildParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        oneName: String;
        oneAge: number;
      };

      class TestAssociationHasOneScopeRecord extends Record {
        public id: TestAssociationHasOneScopeParams['id'];
        public name: TestAssociationHasOneScopeParams['name'];
        public age: TestAssociationHasOneScopeParams['age'];
        public one: t.Record$HasOne<TestAssociationHasOneScopeChildRecord>;

        protected fetchAll(): Promise<TestAssociationHasOneScopeParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
          ]);
        }
      }
      class TestAssociationHasOneScopeChildRecord extends Record {
        public id: TestAssociationHasOneScopeChildParams['id'];
        public parentId: TestAssociationHasOneScopeChildParams['parentId'];
        public oneName: TestAssociationHasOneScopeChildParams['oneName'];
        public oneAge: TestAssociationHasOneScopeChildParams['oneAge'];

        protected fetchAll(): Promise<TestAssociationHasOneScopeChildParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, oneName: 'onne_name_11', oneAge: 11 },
            { id: 2, parentId: 1, oneName: 'onne_name_21', oneAge: 21 },
            { id: 3, parentId: 2, oneName: 'onne_name_22', oneAge: 22 },
            { id: 4, parentId: 2, oneName: 'onne_name_42', oneAge: 42 },
          ]);
        }
      }

      // register relations
      TestAssociationHasOneScopeRecord.hasOne<TestAssociationHasOneScopeChildRecord>(
        'one',
        {
          klass: TestAssociationHasOneScopeChildRecord,
          foreignKey: 'parentId',
        },
        /**
         * @description Limits of type specification in typescript
         */
        (self: any) => self.where({ id: 2 })
      );

      it('should correctly', async () => {
        const record = (await TestAssociationHasOneScopeRecord.first<TestAssociationHasOneScopeRecord>()) as TestAssociationHasOneScopeRecord;
        expect(await record.one()).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          errors: {},
          id: 2,
          oneAge: 21,
          oneName: 'onne_name_21',
          parentId: 1,
        });
      });
    });

    describe('when specify invalid dependent', () => {
      type TestAssociationHasOneInvalidDependentParams = {
        id: t.Record$PrimaryKey;
        name: String;
        age: number;
      };

      type TestAssociationHasOneInvalidDependentChildParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        oneName: String;
        oneAge: number;
      };

      class TestAssociationHasOneInvalidDependentRecord extends Record {
        public id: TestAssociationHasOneInvalidDependentParams['id'];
        public name: TestAssociationHasOneInvalidDependentParams['name'];
        public age: TestAssociationHasOneInvalidDependentParams['age'];
        public one: t.Record$HasOne<TestAssociationHasOneInvalidDependentChildRecord>;

        protected fetchAll(): Promise<TestAssociationHasOneInvalidDependentParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
          ]);
        }
      }
      class TestAssociationHasOneInvalidDependentChildRecord extends Record {
        public id: TestAssociationHasOneInvalidDependentChildParams['id'];
        public parentId: TestAssociationHasOneInvalidDependentChildParams['parentId'];
        public oneName: TestAssociationHasOneInvalidDependentChildParams['oneName'];
        public oneAge: TestAssociationHasOneInvalidDependentChildParams['oneAge'];

        protected fetchAll(): Promise<TestAssociationHasOneInvalidDependentChildParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, oneName: 'onne_name_11', oneAge: 11 },
            { id: 2, parentId: 1, oneName: 'onne_name_21', oneAge: 21 },
            { id: 3, parentId: 2, oneName: 'onne_name_22', oneAge: 22 },
            { id: 4, parentId: 2, oneName: 'onne_name_42', oneAge: 42 },
          ]);
        }
      }

      it('should correctly', () => {
        expect(() => {
          TestAssociationHasOneInvalidDependentRecord.hasOne<TestAssociationHasOneInvalidDependentChildRecord>(
            'one',
            {
              klass: TestAssociationHasOneInvalidDependentChildRecord,
              foreignKey: 'parentId',
              dependent: 'invalid',
            }
          );
        }).toThrowError(
          "The 'dependent' option must be one of [destroy, delete, nullify, restrictWithException, restrictWithError], but is 'invalid'"
        );
      });
    });
  });

  describe('[static] hasMany (default)', () => {
    type TestAssociationHasManyParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasManyChildParams = {
      id: t.Record$PrimaryKey;
      foreignKey: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasManyRecord extends Record {
      public id: TestAssociationHasManyParams['id'];
      public name: TestAssociationHasManyParams['name'];
      public age: TestAssociationHasManyParams['age'];
      public children: t.Record$HasMany<TestAssociationHasManyChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasManyParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasManyChildRecord extends Record {
      public id: TestAssociationHasManyChildParams['id'];
      public foreignKey: TestAssociationHasManyChildParams['foreignKey'];
      public childName: TestAssociationHasManyChildParams['childName'];
      public childAge: TestAssociationHasManyChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasManyChildParams[]> {
        return Promise.resolve([
          { id: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, foreignKey: 1, childName: 'child_name_21', childAge: 21 },
          { id: 3, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
          { id: 4, foreignKey: 2, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationHasManyRecord.hasMany<TestAssociationHasManyChildRecord>('children', {
      klass: TestAssociationHasManyChildRecord,
      foreignKey: 'foreignKey',
    });

    it('should correctly', async () => {
      const record = (await TestAssociationHasManyRecord.first<TestAssociationHasManyRecord>()) as TestAssociationHasManyRecord;
      const result = (await record.children()) as TestAssociationHasManyChildRecord[];
      expect(result.length).toEqual(2);
      expect(result).toEqual([
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 11,
          childName: 'child_name_11',
          errors: {},
          foreignKey: 1,
          id: 1,
        },
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 21,
          childName: 'child_name_21',
          errors: {},
          foreignKey: 1,
          id: 2,
        },
      ]);
    });
  });

  describe("[static] hasMany (specify 'through')", () => {
    type TestAssociationHasManyThroughParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasManyThroughThroughParams = {
      id: t.Record$PrimaryKey;
      parentId: t.Record$ForeignKey;
      childId: t.Record$ForeignKey;
    };

    type TestAssociationHasManyThroughChildParams = {
      id: t.Record$PrimaryKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasManyThroughRecord extends Record<TestAssociationHasManyThroughParams> {
      public id: TestAssociationHasManyThroughParams['id'];
      public name: TestAssociationHasManyThroughParams['name'];
      public age: TestAssociationHasManyThroughParams['age'];
      public children: t.Record$HasMany<TestAssociationHasManyThroughChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasManyThroughParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }

    class TestAssociationHasManyThroughThroughRecord extends Record<TestAssociationHasManyThroughThroughParams> {
      public id: TestAssociationHasManyThroughThroughParams['id'];
      public parentId: TestAssociationHasManyThroughThroughParams['parentId'];
      public childId: TestAssociationHasManyThroughThroughParams['childId'];

      protected fetchAll(): Promise<TestAssociationHasManyThroughThroughParams[]> {
        return Promise.resolve([
          { id: 1, parentId: 1, childId: 1 },
          { id: 2, parentId: 1, childId: 2 },
          { id: 3, parentId: 1, childId: 3 },
          { id: 4, parentId: 2, childId: 4 },
        ]);
      }
    }

    class TestAssociationHasManyThroughChildRecord extends Record<TestAssociationHasManyThroughChildParams> {
      public id: TestAssociationHasManyThroughChildParams['id'];
      public childName: TestAssociationHasManyThroughChildParams['childName'];
      public childAge: TestAssociationHasManyThroughChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasManyThroughChildParams[]> {
        return Promise.resolve([
          { id: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, childName: 'child_name_21', childAge: 21 },
          { id: 3, childName: 'child_name_22', childAge: 22 },
          { id: 4, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationHasManyThroughRecord.hasMany<
      TestAssociationHasManyThroughChildRecord,
      TestAssociationHasManyThroughThroughRecord
    >('children', {
      klass: TestAssociationHasManyThroughChildRecord,
      /**
       * @description If you specify `through`, the `foreignKey` option is ignored.
       */
      foreignKey: 'ignoredId',
      through: {
        klass: TestAssociationHasManyThroughThroughRecord,
        foreignKey: 'parentId',
        associationForeignKey: 'childId',
      },
    });

    it('should correctly', async () => {
      const record = (await TestAssociationHasManyThroughRecord.first<TestAssociationHasManyThroughRecord>()) as TestAssociationHasManyThroughRecord;
      const result = await record.children();
      expect(result).toEqual([
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 11,
          childName: 'child_name_11',
          errors: {},
          id: 1,
        },
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 21,
          childName: 'child_name_21',
          errors: {},
          id: 2,
        },
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 3,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 22,
          childName: 'child_name_22',
          errors: {},
          id: 3,
        },
      ]);
    });
  });

  describe("when hasMany (specify 'scope')", () => {
    type TestAssociationHasManyScopeParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasManyScopeChildParams = {
      id: t.Record$PrimaryKey;
      parentId: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasManyScopeRecord extends Record {
      public id: TestAssociationHasManyScopeParams['id'];
      public name: TestAssociationHasManyScopeParams['name'];
      public age: TestAssociationHasManyScopeParams['age'];
      public children: t.Record$HasMany<TestAssociationHasManyScopeChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasManyScopeParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasManyScopeChildRecord extends Record {
      public id: TestAssociationHasManyScopeChildParams['id'];
      public parentId: TestAssociationHasManyScopeChildParams['parentId'];
      public childName: TestAssociationHasManyScopeChildParams['childName'];
      public childAge: TestAssociationHasManyScopeChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasManyScopeChildParams[]> {
        return Promise.resolve([
          { id: 1, parentId: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, parentId: 1, childName: 'child_name_21', childAge: 21 },
          { id: 3, parentId: 2, childName: 'child_name_22', childAge: 22 },
          { id: 4, parentId: 2, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationHasManyScopeRecord.hasMany<TestAssociationHasManyScopeChildRecord>(
      'children',
      {
        klass: TestAssociationHasManyScopeChildRecord,
        foreignKey: 'parentId',
      },
      /**
       * @description Limits of type specification in typescript
       */
      (self: any) => self.where({ id: [1, 2] as any })
    );

    it('should correctly', async () => {
      const record = (await TestAssociationHasManyScopeRecord.first<TestAssociationHasManyScopeRecord>()) as TestAssociationHasManyScopeRecord;
      expect(await record.children()).toEqual([
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 11,
          childName: 'child_name_11',
          errors: {},
          id: 1,
          parentId: 1,
        },
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 21,
          childName: 'child_name_21',
          errors: {},
          id: 2,
          parentId: 1,
        },
      ]);
    });

    describe('when specify invalid dependent', () => {
      type TestAssociationHasManyInvalidDependentParams = {
        id: t.Record$PrimaryKey;
        name: String;
        age: number;
      };

      type TestAssociationHasManyInvalidDependentChildParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        childName: String;
        childAge: number;
      };

      class TestAssociationHasManyInvalidDependentRecord extends Record {
        public id: TestAssociationHasManyInvalidDependentParams['id'];
        public name: TestAssociationHasManyInvalidDependentParams['name'];
        public age: TestAssociationHasManyInvalidDependentParams['age'];
        public children: t.Record$HasMany<TestAssociationHasManyInvalidDependentChildRecord>;

        protected fetchAll(): Promise<TestAssociationHasManyInvalidDependentParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
          ]);
        }
      }
      class TestAssociationHasManyInvalidDependentChildRecord extends Record {
        public id: TestAssociationHasManyInvalidDependentChildParams['id'];
        public parentId: TestAssociationHasManyInvalidDependentChildParams['parentId'];
        public childName: TestAssociationHasManyInvalidDependentChildParams['childName'];
        public childAge: TestAssociationHasManyInvalidDependentChildParams['childAge'];

        protected fetchAll(): Promise<TestAssociationHasManyInvalidDependentChildParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, childName: 'onne_name_11', childAge: 11 },
            { id: 2, parentId: 1, childName: 'onne_name_21', childAge: 21 },
            { id: 3, parentId: 2, childName: 'onne_name_22', childAge: 22 },
            { id: 4, parentId: 2, childName: 'onne_name_42', childAge: 42 },
          ]);
        }
      }

      it('should correctly', () => {
        expect(() => {
          TestAssociationHasManyInvalidDependentRecord.hasMany<TestAssociationHasManyInvalidDependentChildRecord>(
            'children',
            {
              klass: TestAssociationHasManyInvalidDependentChildRecord,
              foreignKey: 'parentId',
              dependent: 'invalid',
            }
          );
        }).toThrowError(
          "The 'dependent' option must be one of [destroy, deleteAll, nullify, restrictWithException, restrictWithError], but is 'invalid'"
        );
      });
    });
  });

  describe('#buildHasOneRecord', () => {
    type BuildHasOneRecordRecordParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type BuildHasOneRecordOneRecordParams = {
      id: t.Record$PrimaryKey;
      parentId: t.Record$ForeignKey;
      oneName: String;
      oneAge: number;
    };

    class BuildHasOneRecordRecord extends Record<BuildHasOneRecordRecordParams> {
      public id: BuildHasOneRecordRecordParams['id'];
      public name: BuildHasOneRecordRecordParams['name'];
      public age: BuildHasOneRecordRecordParams['age'];
      public one: t.Record$HasOne<BuildHasOneRecordOneRecord>;

      protected fetchAll(): Promise<BuildHasOneRecordRecordParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }

      buildOne(params?: t.Record$Params): Promise<BuildHasOneRecordOneRecord> {
        return this.buildHasOneRecord('one', params);
      }
    }
    class BuildHasOneRecordOneRecord extends Record {
      public id: BuildHasOneRecordOneRecordParams['id'];
      public parentId: BuildHasOneRecordOneRecordParams['parentId'];
      public oneName: BuildHasOneRecordOneRecordParams['oneName'];
      public oneAge: BuildHasOneRecordOneRecordParams['oneAge'];

      protected fetchAll(): Promise<[]> {
        return Promise.resolve([]);
      }
    }

    // register relations
    BuildHasOneRecordRecord.hasMany<BuildHasOneRecordOneRecord>('one', {
      klass: BuildHasOneRecordOneRecord,
      foreignKey: 'parentId',
    });

    describe('when default', () => {
      it('should correctly', async () => {
        const record = (await BuildHasOneRecordRecord.first<BuildHasOneRecordRecord>()) as BuildHasOneRecordRecord;
      });
    });
  });
});
