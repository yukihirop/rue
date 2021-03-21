import { HasOneOptions } from './../types';
import { ActiveRecord$Base } from '@/records';
import { errObj, ErrCodes } from '@/errors';

import { DependentList, AssociationList, HasManyOptions } from '../types';

export class ActiveRecord$Associations$PersistenceStrategy {
  static hasOneSaveStrategyFn<T extends ActiveRecord$Base>(
    relationName: string,
    opts: HasOneOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]().then((oneRecord) => {
        if (oneRecord === null) return true;

        if (opts.autosave) {
          return oneRecord.saveSync({ validate: opts.validate });
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
    opts: HasOneOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]().then((oneRecord) => {
        if (opts.autosave) {
          return oneRecord.saveSyncOrThrow({ validate: opts.validate });
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
    opts: HasManyOptions<T>
  ): (self: T) => Promise<T | boolean | number> {
    return (self: T): Promise<T | boolean | number> => {
      return self[relationName]().then((oneRecord) => {
        if (opts.dependent === DependentList.destroy) {
          return oneRecord.destroySync();
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
    opts: HasManyOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]()
        ._currentScope()
        .then((childrens: T[]) => {
          if (opts.autosave) {
            return childrens
              .map((c) => {
                return c.saveSync({ validate: opts.validate });
              })
              .every(Boolean);
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
    opts: HasManyOptions<T>
  ): (self: T) => Promise<boolean> {
    return (self: T): Promise<boolean> => {
      return self[relationName]()
        ._currentScope()
        .then((childrens: T[]) => {
          if (opts.autosave) {
            return childrens
              .map((c) => {
                return c.saveSyncOrThrow();
              })
              .every(Boolean);
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
    opts: HasManyOptions<T>
  ): (self: T) => Promise<T[] | boolean | number> {
    return (self: T): Promise<T[] | boolean | number> => {
      return self[relationName]()
        .toA()
        .then((records: T[]) => {
          if (opts.dependent === DependentList.destroy) {
            return records.map((r) => r.destroySync());
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
