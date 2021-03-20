import { ActiveRecord$Base } from '@/records';
import { errObj, ErrCodes } from '@/errors';

import { DependentList, AssociationList, HasManyOptions } from '../types';

export class ActiveRecord$Associations$PersistenceStrategy {
  static saveStrategyFn<T extends ActiveRecord$Base>(
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

  static saveOrThrowStrategyFn<T extends ActiveRecord$Base>(
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

  static destroyStrategyFn<T extends ActiveRecord$Base>(
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
