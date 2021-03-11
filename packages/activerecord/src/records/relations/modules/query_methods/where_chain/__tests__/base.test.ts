import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$QueryMethods$WhereChain as WhereChain } from '../base';

describe('WhereChain', () => {
  describe('constructor', () => {
    class WhereChainConstructor extends ActiveRecord$Base {}
    const relation = new ActiveRecord$Relation<WhereChainConstructor>(WhereChainConstructor, [
      new WhereChainConstructor(),
      new WhereChainConstructor(),
      new WhereChainConstructor(),
    ]);
    it('should correctly', () => {
      const allPromiseFn = () => Promise.resolve(relation);
      const whereChain = new WhereChain<WhereChainConstructor>(allPromiseFn);
      expect(JSON.stringify(whereChain)).toEqual('{"params":{}}');
    });
  });

  describe('#where', () => {
    class WhereChainWhere extends ActiveRecord$Base {}
    const relation = new ActiveRecord$Relation<WhereChainWhere>(WhereChainWhere, [
      new WhereChainWhere(),
      new WhereChainWhere(),
      new WhereChainWhere(),
    ]);
    it('should correctly', () => {
      const allPromiseFn = () => Promise.resolve(relation);
      const whereChain = new WhereChain<WhereChainWhere>(allPromiseFn);
      expect(JSON.stringify(whereChain.where({ name: 'name', age: 1 }))).toEqual(
        '{"params":{"name":"name","age":1}}'
      );
      expect(
        JSON.stringify(whereChain.where({ name: 'name', age: 1 }).where({ name: 'override name' }))
      ).toEqual('{"params":{"name":"override name","age":1}}');
    });
  });

  describe('#rewhere', () => {
    class WhereChainReWhere extends ActiveRecord$Base {}
    const relation = new ActiveRecord$Relation<WhereChainReWhere>(WhereChainReWhere, [
      new WhereChainReWhere(),
      new WhereChainReWhere(),
      new WhereChainReWhere(),
    ]);
    it('should correctly', () => {
      const allPromiseFn = () => Promise.resolve(relation);
      const whereChain = new WhereChain<WhereChainReWhere>(allPromiseFn);
      expect(JSON.stringify(whereChain.rewhere({ name: 'name', age: 1 }))).toEqual(
        '{"params":{"name":"name","age":1}}'
      );
      expect(
        JSON.stringify(
          whereChain.where({ name: 'name', age: 1 }).rewhere({ name: 'override name' })
        )
      ).toEqual('{"params":{"name":"override name"}}');
    });
  });

  describe('#toPromiseArray (#toPA)', () => {
    type TestToPromiseArrayParams = {
      name: string;
      age: number;
    };

    class WhereChainToPA extends ActiveRecord$Base {
      public name: TestToPromiseArrayParams['name'];
      public age: TestToPromiseArrayParams['age'];
    }

    const relation = new ActiveRecord$Relation<WhereChainToPA>(WhereChainToPA, [
      new WhereChainToPA({ id: 1, name: 'name_1', age: 1 }),
      new WhereChainToPA({ id: 2, name: 'name_2', age: 2 }),
      new WhereChainToPA({ id: 3, name: 'name_3', age: 3 }),
    ]);

    it('should correctly', (done) => {
      const allPromiseFn = () => Promise.resolve(relation);

      new WhereChain<WhereChainToPA>(allPromiseFn)
        .where({ name: 'name_1', age: 1 })
        .toPromiseArray()
        .then((records: WhereChainToPA[]) => {
          expect(records.length).toEqual(1);
          expect(records[0]).toEqual({
            __rue_record_id__: undefined,
            _destroyed: false,
            _newRecord: true,
            age: 1,
            errors: {},
            id: 1,
            name: 'name_1',
          });
          done();
        });

      new WhereChain<WhereChainToPA>(allPromiseFn)
        .where({ name: ['name_1', 'name_2'] })
        .toPA()
        .then((records: WhereChainToPA[]) => {
          expect(records.length).toEqual(2);
          expect(records).toEqual([
            {
              __rue_record_id__: undefined,
              _destroyed: false,
              _newRecord: true,
              age: 1,
              errors: {},
              id: 1,
              name: 'name_1',
            },
            {
              __rue_record_id__: undefined,
              _destroyed: false,
              _newRecord: true,
              age: 2,
              errors: {},
              id: 2,
              name: 'name_2',
            },
          ]);
          done();
        });

      new WhereChain<WhereChainToPA>(allPromiseFn)
        .where({ name: 'name_4' })
        .rewhere({ name: 'name_1' })
        .toPA()
        .then((records: WhereChainToPA[]) => {
          expect(records.length).toEqual(1);
          expect(records).toEqual([
            {
              __rue_record_id__: undefined,
              _destroyed: false,
              _newRecord: true,
              age: 1,
              errors: {},
              id: 1,
              name: 'name_1',
            },
          ]);
          done();
        });
    });
  });
});
