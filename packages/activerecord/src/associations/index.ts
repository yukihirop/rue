// classes
export {
  ActiveRecord$Associations$Core as Association,
  Association as AssociationList,
} from './core';

// types
export type {
  // Association
  PrimaryKey as Association$PrimaryKey,
  ForeignKey as Association$ForeignKey,
  IntermediateTable as Association$IntermediateTable,
  BelongsTo as Association$BelongsTo,
  HasOne as Association$HasOne,
  HasMany as Association$HasMany,
  HasAndBelongsToMany as Association$HasAndBelongsToMany,
  // CollectionProxyModule
  CollectionProxy$Scope as Association$Scope,
} from './types';
