// locals
import { ActiveRecord$Base as Record } from '../base';

// thrid party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

type DirtyRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

class DirtyRecord extends Record<DirtyRecordParams> {
  public id: DirtyRecordParams['id'];
  public name: DirtyRecordParams['name'];
  public age: DirtyRecordParams['age'];

  protected fetchAll(): Promise<DirtyRecordParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]);
  }
}

describe('ActiveRecord$Base (ActiveRecord$Dirty)', () => {
  beforeEach(async () => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#isChanged', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const record = (await DirtyRecord.first<DirtyRecord>()) as DirtyRecord;
        expect(record.isChanged()).toEqual(false);
        record.name = 'rename';
        expect(record.isChanged()).toEqual(true);
      });
    });

    describe('when after build', () => {
      it('should correctly', () => {
        const record = new DirtyRecord();
        expect(record.isChanged()).toEqual(false);
        record.name = 'rename';
        expect(record.isChanged()).toEqual(true);
      });
    });
  });
});
