import { WhereChain } from '../where_chain';

describe('WhereChain', () => {
  describe('constructor', () => {
    it('should correctly', () => {
      const allPromiseFn = () => Promise.resolve([1, 2, 3]);
      const whereChain = new WhereChain<number>(allPromiseFn);
      expect(JSON.stringify(whereChain)).toEqual('{"params":{}}');
    });
  });

  describe('#where', () => {
    it('should correctly', () => {
      const allPromiseFn = () => Promise.resolve([1, 2, 3]);
      const whereChain = new WhereChain<number>(allPromiseFn);
      expect(JSON.stringify(whereChain.where({ name: 'name', age: 1 }))).toEqual(
        '{"params":{"name":"name","age":1}}'
      );
      expect(
        JSON.stringify(whereChain.where({ name: 'name', age: 1 }).where({ name: 'override name' }))
      ).toEqual('{"params":{"name":"override name","age":1}}');
    });
  });

  describe('#rewhere', () => {
    it('should correctly', () => {
      const allPromiseFn = () => Promise.resolve([1, 2, 3]);
      const whereChain = new WhereChain<number>(allPromiseFn);
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

    it('should correctly', (done) => {
      const allPromiseFn = () =>
        Promise.resolve([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
          { name: 'name_3', age: 2 },
        ]);
      const whereChain = new WhereChain<TestToPromiseArrayParams>(allPromiseFn);

      whereChain
        .where({ name: 'name_1', age: 1 })
        .toPromiseArray()
        .then((records: TestToPromiseArrayParams[]) => {
          expect(records.length).toEqual(1);
          expect(records[0].name).toEqual('name_1');
          expect(records[0].age).toEqual(1);
          done();
        });

      whereChain
        .where({ name: 'name_4' })
        .rewhere({ name: 'name_1' })
        .toPA()
        .then((records: TestToPromiseArrayParams[]) => {
          expect(records.length).toEqual(1);
          expect(records[0].name).toEqual('name_1');
          expect(records[0].age).toEqual(1);
          done();
        });
    });
  });
});
