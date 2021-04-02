import { BelongsTo } from './../types';
// locals
import { ActiveRecord$Base } from '@/records';
import { errObj, ErrCodes } from '@/errors';

// enum
import { DependentList, AssociationList } from '../types';

import type * as rmat from '@/records/modules/associations/types';

export class ActiveRecord$Associations$PersistenceStrategy {
  static belongsToSaveStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.BelongsToOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]().then((belongsToRecord) => {
        if (belongsToRecord === null) return true;

        if (opts.autosave) {
          belongsToRecord[opts.foreignKey] = self.id;
          return belongsToRecord.save({ validate: opts.validate });
        } else {
          if (opts.validate) {
            const validResult = belongsToRecord.isValid();
            if (!validResult) {
              if (!self.errors[AssociationList.belongsTo]) {
                self.errors[AssociationList.belongsTo] = {
                  [relationName]: [
                    errObj({
                      code: ErrCodes.RECORD_IS_INVALID,
                      params: {
                        inspect: opts.klass.name,
                      },
                    }),
                  ],
                };
              }
            }
            return validResult;
          } else {
            /**
             * @description Skip saving associated record
             */
            return true;
          }
        }
      });
    };
  }

  static belongsToSaveOrThrowStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.HasOneOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]().then((belongsToRecord) => {
        if (belongsToRecord === null) return true;

        if (opts.autosave) {
          belongsToRecord[opts.foreignKey] = self.id;
          const saveResult = belongsToRecord.saveOrThrow({ validate: opts.validate });
          return saveResult;
        } else {
          if (opts.validate) {
            const validResult = belongsToRecord.isValid();
            if (!validResult) {
              if (!self.errors[AssociationList.belongsTo]) {
                const err = errObj({
                  code: ErrCodes.RECORD_IS_INVALID,
                  params: {
                    inspect: opts.klass.name,
                  },
                });
                self.errors[AssociationList.belongsTo] = {
                  [relationName]: [err],
                };
                throw err;
              }
            }
            return validResult;
          } else {
            /**
             * @description Skip saving associated record
             */
            return true;
          }
        }
      });
    };
  }

  static belongsToDestroyStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.BelongsToOptions<T>
  ): (self: T) => Promise<T | boolean | number> {
    return (self: T): Promise<T | boolean | number> => {
      return self[relationName]().then((belongsToRecord) => {
        if (opts.dependent === DependentList.destroy) {
          return belongsToRecord.destroy();
        } else if (opts.dependent === DependentList.delete) {
          const belongsToKlass = opts.klass;
          /**
           * @description  If set to :delete, the associated object is deleted without calling its destroy method.
           */
          // @ts-expect-error
          const deleteResult = belongsToKlass.delete(belongsToRecord.id);
          if (deleteResult) {
            belongsToRecord._destroyed = true;
            self._associationCache[relationName].associationScope = [belongsToRecord];
          }
          return deleteResult;
        } else {
          throw errObj({
            code: ErrCodes.FOREIGN_KEY_CONSTRAIT_FAILS,
            params: {
              resource: self.constructor.name,
              foreignKey: opts.foreignKey,
            },
          });
        }
      });
    };
  }

  static hasOneSaveStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.HasOneOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]().then((oneRecord) => {
        if (oneRecord === null) return true;

        if (opts.autosave) {
          return oneRecord.save({ validate: opts.validate });
        } else {
          if (opts.validate) {
            const validResult = oneRecord.isValid();
            if (!validResult) {
              if (!self.errors[AssociationList.hasOne]) {
                self.errors[AssociationList.hasOne] = {
                  [relationName]: [
                    errObj({
                      code: ErrCodes.RECORD_IS_INVALID,
                      params: {
                        inspect: opts.klass.name,
                      },
                    }),
                  ],
                };
              }
            }
            return validResult;
          } else {
            /**
             * @description Skip saving associated record
             */
            return true;
          }
        }
      });
    };
  }

  static hasOneSaveOrThrowStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.HasOneOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]().then((oneRecord) => {
        if (opts.autosave) {
          return oneRecord.saveOrThrow({ validate: opts.validate });
        } else {
          if (opts.validate) {
            const validResult = oneRecord.isValid();
            if (!validResult) {
              if (!self.errors[AssociationList.hasOne]) {
                self.errors[AssociationList.hasOne] = {
                  [relationName]: [
                    errObj({
                      code: ErrCodes.RECORD_IS_INVALID,
                      params: {
                        inspect: opts.klass.name,
                      },
                    }),
                  ],
                };
              }
            }
            return validResult;
          } else {
            /**
             * @description Skip saving associated record
             */
            return true;
          }
        }
      });
    };
  }

  static hasOneDestroyStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.HasOneOptions<T>
  ): (self: T) => Promise<T | boolean | number> {
    return (self: T): Promise<T | boolean | number> => {
      return self[relationName]().then((oneRecord) => {
        if (opts.dependent === DependentList.destroy) {
          return oneRecord.destroy();
        } else if (opts.dependent === DependentList.nullify) {
          return oneRecord.update({ [opts.foreignKey]: undefined });
        } else if (opts.dependent === DependentList.delete) {
          const hasOneKlass = opts.klass;
          // @ts-expect-error
          const deleteResult = hasOneKlass.delete(oneRecord.id);
          if (deleteResult) {
            self._associationCache[relationName].associationScope = [];
          }
          return deleteResult;
        } else if (opts.dependent === DependentList.restrictWithException) {
          if (oneRecord != {} && oneRecord != null) {
            throw errObj({
              code: ErrCodes.DELETE_RESTRICTION_ERROR,
              params: {
                associatedResource: opts.klass.name,
              },
            });
          }
        } else if (opts.dependent === DependentList.restrictWithError) {
          if (oneRecord != {} && oneRecord != null) {
            if (!self.errors[AssociationList.hasOne]) self.errors[AssociationList.hasOne] = {};
            self.errors[AssociationList.hasOne][relationName] = [
              errObj({
                code: ErrCodes.DELETE_RESTRICTION_ERROR,
                params: {
                  associatedResource: opts.klass.name,
                },
              }),
            ];
            return false;
          }
        } else {
          throw errObj({
            code: ErrCodes.FOREIGN_KEY_CONSTRAIT_FAILS,
            params: {
              resource: self.constructor.name,
              foreignKey: opts.foreignKey,
            },
          });
        }
      });
    };
  }

  static hasManySaveStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.HasManyOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]()
        ._currentScope()
        .then((childrens: T[]) => {
          if (opts.autosave) {
            return Promise.all(childrens.map((c) => c.save({ validate: opts.validate }))).then(
              (result) => {
                return result.every(Boolean);
              }
            );
          } else {
            if (opts.validate) {
              const childrenResult = childrens
                .map((c) => {
                  return c.isValid();
                })
                .every(Boolean);

              if (!childrenResult) {
                if (!self.errors[AssociationList.hasMany])
                  self.errors[AssociationList.hasMany] = {};
                self.errors[AssociationList.hasMany][relationName] = [
                  errObj({
                    code: ErrCodes.RECORD_IS_INVALID,
                    params: {
                      inspect: opts.klass.name,
                    },
                  }),
                ];
              }
              return childrenResult;
            } else {
              /**
               * @description Skip saving associated records
               */
              return true;
            }
          }
        });
    };
  }

  static hasManySaveOrThrowStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.HasManyOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]()
        ._currentScope()
        .then((childrens: T[]) => {
          if (opts.autosave) {
            return Promise.all(
              childrens.map((c) => c.saveOrThrow({ validate: opts.validate }))
            ).then((result) => {
              return result.every(Boolean);
            });
          } else {
            /**
             * @description Skip saving associated records
             */
            return true;
          }
        });
    };
  }

  static hasManyDestroyStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: rmat.HasManyOptions<T>
  ): (self: T) => Promise<T[] | boolean | number> {
    return (self: T): Promise<T[] | boolean | number> => {
      return self[relationName]()
        .toA()
        .then((records: T[]) => {
          if (opts.dependent === DependentList.destroy) {
            return Promise.all(records.map((r) => r.destroy()));
          } else if (opts.dependent === DependentList.nullify) {
            return records.map((r) => {
              r.update({ [opts.foreignKey]: undefined });
              return r;
            });
          } else if (opts.dependent === DependentList.deleteAll) {
            const recordIds = records.map((r) => r.id);
            const hasManyKlass = opts.klass;
            // @ts-expect-error
            hasManyKlass.delete(recordIds);
          } else if (opts.dependent === DependentList.restrictWithException) {
            if (records.length > 0) {
              throw errObj({
                code: ErrCodes.DELETE_RESTRICTION_ERROR,
                params: {
                  associatedResource: opts.klass.name,
                },
              });
            }
          } else if (opts.dependent === DependentList.restrictWithError) {
            if (records.length > 0) {
              if (!self.errors[AssociationList.hasMany]) self.errors[AssociationList.hasMany] = {};
              self.errors[AssociationList.hasMany][relationName] = [
                errObj({
                  code: ErrCodes.DELETE_RESTRICTION_ERROR,
                  params: {
                    associatedResource: opts.klass.name,
                  },
                }),
              ];
              return false;
            }
          } else {
            throw errObj({
              code: ErrCodes.FOREIGN_KEY_CONSTRAIT_FAILS,
              params: {
                resource: self.constructor.name,
                foreignKey: opts.foreignKey,
              },
            });
          }
        });
    };
  }
}
