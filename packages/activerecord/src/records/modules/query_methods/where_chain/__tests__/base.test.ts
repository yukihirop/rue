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
      new WhereChainToPA({ name: 'name_1', age: 1 }),
      new WhereChainToPA({ name: 'name_2', age: 2 }),
      new WhereChainToPA({ name: 'name_3', age: 3 }),
    ]);

    it('should correctly', (done) => {
      const allPromiseFn = () => Promise.resolve(relation);
      const whereChain = new WhereChain<WhereChainToPA>(allPromiseFn);

      whereChain
        .where({ name: 'name_1', age: 1 })
        .toPromiseArray()
        .then((records: WhereChainToPA[]) => {
          expect(records.length).toEqual(1);
          expect(records[0].name).toEqual('name_1');
          expect(records[0].age).toEqual(1);
          done();
        });

      whereChain
        .where({ name: 'name_4' })
        .rewhere({ name: 'name_1' })
        .toPA()
        .then((records: WhereChainToPA[]) => {
          expect(records.length).toEqual(1);
          expect(records[0].name).toEqual('name_1');
          expect(records[0].age).toEqual(1);
          done();
        });
    });
  });
});
