// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Associations$Impl } from './impl';
import {
  registryForAssociations as AssociationRegistry,
  cacheForIntermeditateTables as IntermediateTable,
} from '@/registries';
import { errObj, ErrCodes } from '@/errors';
import { DependentList, AssociationList } from './types';

// types
import type * as ct from '@/types';
import type * as t from './types';
import type * as art from '@/records/relations/types';

export class ActiveRecord$Associations extends ActiveRecord$Associations$Impl {
  public id: t.PrimaryKey;

  static belongsTo<T extends ActiveRecord$Base = any>(
    relationName: string,
    klass: Function,
    foreignKey: string
  ) {
    AssociationRegistry.create(this.name, AssociationList.belongsTo, {
      [relationName]: {
        relationFn: (self: T) => (klass as any).findBy({ id: self[foreignKey] }),
      },
    });
  }

  static hasOne<T extends ActiveRecord$Base = any>(
    relationName: string,
    klass: Function,
    foreignKey: t.ForeignKey
  ) {
    AssociationRegistry.create(this.name, AssociationList.hasOne, {
      [relationName]: {
        relationFn: (self: T) => (klass as any).findBy({ [foreignKey]: self.id }),
      },
    });
  }

  static hasMany<T extends ActiveRecord$Base>(
    relationName: string,
    opts: t.HasManyOptions<T>,
    scope?: t.HasManyScope<T>
  ) {
    const relationFn = (self: T) => {
      /**
       * @description I'm worried about the overhead, but load it dynamically to avoid circular references
       */
      const {
        ActiveRecord$Associations$CollectionProxy$Holder: Holder,
      } = require('../../associations/collection_proxy');

      const foreignKeyData = { [opts.foreignKey]: self.id };
      const associationData = {
        dependent: opts.dependent,
        validate: opts.validate,
        foreignKeyData,
      };
      const holder = new Holder(opts.klass, [], associationData);

      if (self._associationCache[relationName]) {
        const oldHolder = self._associationCache[relationName].associationHolder;
        holder.proxy = Array.from(oldHolder.proxy);
        holder.flags = oldHolder.flags;
        self._associationCache[relationName].associationHolder = holder;
      } else {
        self._associationCache[relationName] = {};
        self._associationCache[relationName].associationHolder = holder;
      }

      let useScope;
      if (holder.flags.useProxy) {
        useScope = holder.proxy;
      } else {
        if (scope) {
          useScope = scope(opts.klass).toA();
        } else {
          // @ts-expect-error
          useScope = opts.klass.where<T>(foreignKeyData).toA();
        }
      }

      const runtimeScope = createRuntimeAssociationRelation<T, any>((resolve, _reject) => {
        resolve({ holder, scope: useScope });
      }, opts.klass)
        .where(foreignKeyData)
        .toA();

      /**
       * @description Since it is a runtime specification, only any type can be given.
       */
      const collectionProxy = createRuntimeCollectionProxy<T, any>((resolve, _reject) => {
        resolve({ holder, scope: runtimeScope });
      }, opts.klass);
      return collectionProxy;
    };

    if (opts.validate === undefined) opts.validate = true;
    const saveStrategy = (self: T): Promise<boolean> => {
      return self[relationName]()
        ._mergeProxy()
        .then((childrens: T[]) => {
          return childrens
            .map((c) => {
              return c.saveSync({ validate: opts.validate });
            })
            .every(Boolean);
        });
    };

    const saveOrThrowStrategy = (self: T): Promise<boolean> => {
      return self[relationName]()
        ._mergeProxy()
        .then((childrens: T[]) => {
          return childrens
            .map((c) => {
              return c.saveSyncOrThrow();
            })
            .every(Boolean);
        });
    };

    const destroyStrategy = (self: T): Promise<T[]> => {
      return self[relationName]()
        .toA()
        .then((records: T[]) => {
          if (opts.dependent === DependentList.destroy) {
            return records.map((r) => r.destroy());
          } else if (opts.dependent === DependentList.nullify) {
            return records.map((r) => {
              r.update({ [opts.foreignKey]: undefined });
              return r;
            });
          }
        });
    };

    /**
     * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_many
     */
    AssociationRegistry.create(this.name, AssociationList.hasMany, {
      [relationName]: {
        relationFn,
        saveStrategy,
        saveOrThrowStrategy,
        destroyStrategy,
      },
    });
  }

  /**
   * @todo use scope
   * @todo change return value CollectionProxy runtime instance
   */
  static hasAndBelongsToMany<T extends ActiveRecord$Base>(
    relationName: string,
    opts: t.HasAndBelongsToManyOptions<T>,
    _scope?: t.HasAndBelongsToManyOptions<T>
  ) {
    const klass = opts.klass;
    const foreignKeysFn = (self: T) => {
      const tables = IntermediateTable.read<[t.ForeignKey, t.ForeignKey][]>(
        this.name,
        klass.name,
        'array'
      );
      return tables.reduce((acc, pair) => {
        if (pair[0] == self.id) {
          acc.push(pair[1]);
        }
        return acc;
      }, []);
    };

    IntermediateTable.create(this.name, klass.name, []);
    AssociationRegistry.create(this.name, AssociationList.hasAndBelongsToMany, {
      [relationName]: {
        relationFn: (self: T) => (klass as any).where({ id: foreignKeysFn(self) }),
      },
    });
  }

  hasAndBelongsToMany<T extends ActiveRecord$Base = any>(
    record: T
  ): { [key: string]: t.ForeignKey } {
    const klassNameLeft = this.constructor.name;
    const klassNameRight = record.constructor.name;

    const tables = IntermediateTable.read<[t.ForeignKey, t.ForeignKey][]>(
      klassNameLeft,
      klassNameLeft,
      'array'
    );

    if (Array.isArray(tables)) {
      IntermediateTable.create(klassNameLeft, klassNameRight, [[this.id, record.id]]);
      return { [klassNameLeft]: this.id, [klassNameRight]: record.id };
    } else {
      throw errObj({
        code: ErrCodes.RECORD_DO_NOT_HAVE_HAS_AND_BELONGS_TO_MANY,
        params: {
          klassNameLeft,
          klassNameRight,
        },
      });
    }
  }

  releaseAndBelongsToMany<T extends ActiveRecord$Base = any>(
    record: T
  ): { [key: string]: t.ForeignKey } {
    const klassNameLeft = this.constructor.name;
    const klassNameRight = record.constructor.name;

    const beforeIntermediateTable = IntermediateTable.read<[t.ForeignKey, t.ForeignKey][]>(
      klassNameLeft,
      klassNameRight
    );

    if (Array.isArray(beforeIntermediateTable)) {
      let leavedData = [];
      let deleteData = [];
      beforeIntermediateTable.forEach((pair) => {
        if (this.id == pair[0] && record.id == pair[1]) {
          deleteData.push(pair);
        } else {
          leavedData.push(pair);
        }
      });
      IntermediateTable.update(klassNameLeft, klassNameRight, leavedData);
      return { [klassNameLeft]: this.id, [klassNameRight]: record.id };
    } else {
      throw errObj({
        code: ErrCodes.RECORD_DO_NOT_HAVE_HAS_AND_BELONGS_TO_MANY,
        params: {
          klassNameLeft,
          klassNameRight,
        },
      });
    }
  }

  static _defineAssociations<T extends ActiveRecord$Base>(self: T) {
    const allAssociations = AssociationRegistry.data[self.constructor.name];
    if (allAssociations == undefined) return;

    Object.keys(allAssociations).forEach((associationName: string) => {
      const relationData = allAssociations[associationName];

      Object.keys(relationData).forEach((relationName: string) => {
        const relationFn = relationData[relationName].relationFn;

        Object.defineProperty(self, relationName, {
          enumerable: true,
          configurable: false,
          value: () => relationFn<T>(self),
        });
      });
    });
  }
}

function createRuntimeCollectionProxy<T extends ActiveRecord$Base, H>(
  // @ts-expect-error
  executor: art.PromiseExecutor<T, H>,
  recordKlass: ct.Constructor<T>
) {
  /**
   * @description I'm worried about the overhead, but load it dynamically to avoid circular references
   */
  const { ActiveRecord$Associations$CollectionProxy } = require('../../associations');

  const runtimeKlassName = `${recordKlass.name}$ActiveRecord_Associations_CollectionProxy`;
  const runtimeKlass = {
    [runtimeKlassName]: class extends ActiveRecord$Associations$CollectionProxy<T> {},
  }[runtimeKlassName];

  // @ts-expect-error
  return new runtimeKlass(executor)._init(recordKlass);
}

function createRuntimeAssociationRelation<T extends ActiveRecord$Base, H>(
  // @ts-expect-error
  executor: art.PromiseExecutor<T, H>,
  recordKlass: ct.Constructor<T>
) {
  /**
   * @description I'm worried about the overhead, but load it dynamically to avoid circular references
   */
  const { ActiveRecord$Associations$Relation } = require('../../associations');
  const runtimeKlassName = `${recordKlass.name}$ActiveRecord_AssociationRelation`;
  const runtimeKlass = {
    [runtimeKlassName]: class extends ActiveRecord$Associations$Relation<T> {},
  }[runtimeKlassName];

  // @ts-expect-error
  return new runtimeKlass(executor)._init(recordKlass);
}
