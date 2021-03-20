// locals
import { ActiveRecord$Base } from '@/records';
import { AssociationList } from '@/records/modules/associations';

export type AssociationsBelongsToValue = {
  relationFn: <T extends ActiveRecord$Base>(self: T) => Promise<T[]>;
};
export type AssociationsHasOneValue = AssociationsBelongsToValue;
export type AssociationsHasManyValue = {
  relationFn: <T extends ActiveRecord$Base>(self: T) => Promise<T[]>;
  saveStrategy?: <T extends ActiveRecord$Base>(self: T) => Promise<boolean>;
  saveOrThrowStrategy?: <T extends ActiveRecord$Base>(self: T) => Promise<boolean>;
  destroyStrategy?: <T extends ActiveRecord$Base>(self: T) => Promise<T[] | boolean | number>;
};

export type AssociationsData = {
  [uniqueRelationName: string]:
    | AssociationsBelongsToValue
    | AssociationsHasOneValue
    | AssociationsHasManyValue;
};

export type Associations = {
  [associationName in AssociationList]: AssociationsData;
};

export type Scopes = {
  scope: {
    [uniqueScopeName: string]: (
      self: typeof ActiveRecord$Base,
      ...args
    ) => Promise<ActiveRecord$Base[]>;
  };
};

export type Records = {
  __rue_auto_increment_record_id__: number;
  all: Array<ActiveRecord$Base>;
};
