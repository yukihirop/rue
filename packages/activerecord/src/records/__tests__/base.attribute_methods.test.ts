// locals
import { ActiveRecord$Base as Record } from '../base';

// thrid party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

type AttributeMethodRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

class AttributeMethodRecord extends Record<AttributeMethodRecordParams> {
  public id: AttributeMethodRecordParams['id'];
  public name: AttributeMethodRecordParams['name'];
  public age: AttributeMethodRecordParams['age'];

  protected fetchAll(): Promise<AttributeMethodRecordParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]);
  }

  get uniqueKey(): string {
    return 'AttributeMethodRecord';
  }
}

describe('ActiveRecord$Base (ActiveRecord$AttributeMethods)', () => {
  beforeEach(async () => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#attributes (alias to properties)', () => {
    it('should correctly', async () => {
      const record = (await AttributeMethodRecord.first<AttributeMethodRecord>()) as AttributeMethodRecord;
      expect(record.attributes()).toEqual({
        __rue_created_at__: '2021-03-05T23:03:21+09:00',
        __rue_record_id__: 1,
        __rue_updated_at__: '2021-03-05T23:03:21+09:00',
        age: 1,
        id: 1,
        name: 'name_1',
      });
      expect(record.properties()).toEqual({
        __rue_created_at__: '2021-03-05T23:03:21+09:00',
        __rue_record_id__: 1,
        __rue_updated_at__: '2021-03-05T23:03:21+09:00',
        age: 1,
        id: 1,
        name: 'name_1',
      });
    });
  });
});
