// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Associations$Impl } from './impl';
import { registryForAssociations as AssociationRegistry } from '@/registries';
import { ActiveRecord$Associations$PersistenceStrategy as PersistenceStrategy } from './persistence_strategy';
import { isPresent } from '@/utils';
import { errObj, ErrCodes } from '@/errors';

// enums
import { AssociationList, DependentList } from './types';

// types
import type * as ct from '@/types';
import type * as rt from '@/index';
import type * as t from './types';
import type * as art from '@/records/relations/types';

export class ActiveRecord$Associations extends ActiveRecord$Associations$Impl {
  public id: t.PrimaryKey;

  static belongsTo<T extends ActiveRecord$Base = any>(
    relationName: string,
    opts: t.BelongsToOptions<T>,
    scope?: t.BelongsToScope<T>
  ) {
    const validDependentList = ['delete', 'destroy'];
    if (opts.dependent && !validDependentList.includes(opts.dependent)) {
      throw errObj({
        code: ErrCodes.ARGUMENT_IS_INVALID,
        message: `The 'dependent' option must be one of [${validDependentList.join(
          ', '
        )}], but is '${opts.dependent}'`,
      });
    }

    const relationFn = (self: T) => {
      /**
       * @description I'm worried about the overhead, but load it dynamically to avoid circular references
       */
      const { ActiveRecord$Associations$Holder: Holder } = require('../../associations');

      const foreignKeyData = { [opts.foreignKey]: self.id };
      const associationData = {
        dependent: opts.dependent,
        validate: opts.validate,
        foreignKeyData,
      };
      const holder = new Holder(opts.klass, [], associationData);

      /**
       * @description Update _associationCache.
       */
      if (self._associationCache[relationName]) {
        self._associationCache[relationName].associationHolder = holder;
      } else {
        self._associationCache[relationName] = {};
        self._associationCache[relationName].associationHolder = holder;
      }

      let useScope: Promise<T>;
      if (scope) {
        useScope = scope(opts.klass).first() as Promise<T>;
      } else {
        if (self._associationCache[relationName].associationScope as T[]) {
          useScope = Promise.resolve(self._associationCache[relationName].associationScope[0]);
        } else {
          useScope = (opts.klass as any)
            .findBy({ id: self[opts.foreignKey] })
            .then((belongsToRecord) => {
              self._associationCache[relationName].associationScope = [belongsToRecord];
              return belongsToRecord;
            });
        }
      }

      return useScope;
    };

    // default
    if (opts.validate === undefined) opts.validate = true;
    if (opts.autosave === undefined) opts.autosave = true;

    AssociationRegistry.create(this.name, AssociationList.belongsTo, {
      [relationName]: {
        relationFn,
        saveStrategy: PersistenceStrategy.belongsToSaveStrategyFn(relationName, opts),
        saveOrThrowStrategy: PersistenceStrategy.belongsToSaveOrThrowStrategyFn(relationName, opts),
        destroyStrategy: PersistenceStrategy.belongsToDestroyStrategyFn(relationName, opts),
      },
    });
  }

  static hasOne<T extends ActiveRecord$Base = any>(
    relationName: string,
    opts: t.HasOneOptions<T>,
    scope?: t.HasOneScope<T>
  ) {
    const validDependentList = Object.values(DependentList).filter((d) => d != 'deleteAll');
    if (opts.dependent && !validDependentList.includes(opts.dependent)) {
      throw errObj({
        code: ErrCodes.ARGUMENT_IS_INVALID,
        message: `The 'dependent' option must be one of [${validDependentList.join(
          ', '
        )}], but is '${opts.dependent}'`,
      });
    }

    const relationFn = (self: T): Promise<T> => {
      /**
       * @description I'm worried about the overhead, but load it dynamically to avoid circular references
       */
      const { ActiveRecord$Associations$Holder: Holder } = require('../../associations');

      /**
       * @description If you specify `through`, the `foreignKey` option is ignored.
       */
      let foreignKeyData;
      if (isPresent(opts.through)) {
        foreignKeyData = { [opts.through.foreignKey]: self.id };
      } else {
        foreignKeyData = { [opts.foreignKey]: self.id };
      }

      const associationData = {
        dependent: opts.dependent,
        validate: opts.validate,
        foreignKeyData,
      };
      const holder = new Holder(opts.klass, [], associationData);

      /**
       * @description Update _associationCache.
       */
      if (self._associationCache[relationName]) {
        self._associationCache[relationName].associationHolder = holder;
      } else {
        self._associationCache[relationName] = {};
        self._associationCache[relationName].associationHolder = holder;
      }

      let useScope: Promise<T>;

      /**
       * @description Decide which scope to use.
       * @description If you specify `through`, the `foreignKey` option and `scope` is ignored.
       */
      if (isPresent(opts.through)) {
        const {
          klass: throughKlass,
          foreignKey: foreignKeyName,
          associationForeignKey: associationForeignKeyName,
        } = opts.through;

        useScope = throughKlass
          // @ts-expect-error
          .where<T>({ [foreignKeyName]: self.id })
          .toA()
          .then((throughRecords) => {
            const associationIds = throughRecords.map((r) => r[associationForeignKeyName]);
            return (
              opts.klass
                // @ts-expect-error
                .where<T>({ id: associationIds })
                .first()
            );
          });
      } else {
        if (scope) {
          useScope = scope(opts.klass).first() as Promise<T>;
        } else {
          if (self._associationCache[relationName].associationScope as T[]) {
            useScope = Promise.resolve(self._associationCache[relationName].associationScope[0]);
          } else {
            // @ts-expect-error
            useScope = opts.klass.findBy(foreignKeyData).then((oneRecord) => {
              self._associationCache[relationName].associationScope = [oneRecord];
              return oneRecord;
            });
          }
        }
      }

      return useScope;
    };

    // default
    if (opts.validate === undefined) opts.validate = true;
    if (opts.autosave === undefined) opts.autosave = true;

    AssociationRegistry.create(this.name, AssociationList.hasOne, {
      [relationName]: {
        relationFn,
        saveStrategy: PersistenceStrategy.hasOneSaveStrategyFn(relationName, opts),
        saveOrThrowStrategy: PersistenceStrategy.hasOneSaveOrThrowStrategyFn(relationName, opts),
        destroyStrategy: PersistenceStrategy.hasOneDestroyStrategyFn(relationName, opts),
      },
    });
  }

  static hasMany<T extends ActiveRecord$Base>(
    relationName: string,
    opts: t.HasManyOptions<T>,
    scope?: t.HasManyScope<T>
  ) {
    const validDependentList = Object.values(DependentList).filter((d) => d != 'delete');
    if (opts.dependent && !validDependentList.includes(opts.dependent)) {
      throw errObj({
        code: ErrCodes.ARGUMENT_IS_INVALID,
        message: `The 'dependent' option must be one of [${validDependentList.join(
          ', '
        )}], but is '${opts.dependent}'`,
      });
    }

    const relationFn = (self: T) => {
      /**
       * @description I'm worried about the overhead, but load it dynamically to avoid circular references
       */
      const {
        ActiveRecord$Associations$CollectionProxy$Holder: Holder,
      } = require('../../associations/collection_proxy');

      /**
       * @description If you specify `through`, the `foreignKey` option is ignored.
       */
      let foreignKeyData;
      if (isPresent(opts.through)) {
        foreignKeyData = { [opts.through.foreignKey]: self.id };
      } else {
        foreignKeyData = { [opts.foreignKey]: self.id };
      }

      const associationData = {
        dependent: opts.dependent,
        validate: opts.validate,
        foreignKeyData: isPresent(opts.through) ? {} : foreignKeyData,
      };
      const holder = new Holder(opts.klass, [], associationData);

      /**
       * @description Update _associationCache.
       */
      if (self._associationCache[relationName]) {
        const oldHolder = self._associationCache[relationName].associationHolder as any;
        holder.proxy = Array.from(oldHolder.proxy);
        holder.flags = oldHolder.flags;
        self._associationCache[relationName].associationHolder = holder;
      } else {
        self._associationCache[relationName] = {};
        self._associationCache[relationName].associationHolder = holder;
      }

      let useScope: T[] | Promise<T[]>;

      /**
       * @description Decide which scope to use.
       * @description If you specify `through`, the `foreignKey` option and `scope` is ignored.
       */
      if (isPresent(opts.through)) {
        const {
          klass: throughKlass,
          foreignKey: foreignKeyName,
          associationForeignKey: associationForeignKeyName,
        } = opts.through;

        if (holder.flags.useProxy) {
          /**
           * @description Pass by value so that 「proxy === record」 does not occur
           */
          useScope = Array.from(holder.proxy);
        } else {
          useScope = throughKlass
            // @ts-expect-error
            .where<T>({ [foreignKeyName]: self.id })
            .toA()
            .then((throughRecords) => {
              const associationIds = throughRecords.map((r) => r[associationForeignKeyName]);
              return (
                opts.klass
                  // @ts-expect-error
                  .where<T>({ id: associationIds })
                  .toA()
              );
            });
        }
      } else {
        if (holder.flags.useProxy) {
          /**
           * @description Pass by value so that 「proxy === record」 does not occur
           */
          useScope = Array.from(holder.proxy);
        } else {
          if (scope) {
            useScope = scope(opts.klass).toA();
          } else {
            // @ts-expect-error
            useScope = opts.klass.where<T>(foreignKeyData).toA();
          }
        }
      }

      const runtimeScope = createRuntimeAssociationRelation<T, any>((resolve, _reject) => {
        resolve({ holder, scope: useScope });
      }, opts.klass);

      /**
       * @description Since it is a runtime specification, only any type can be given.
       */
      const collectionProxy = createRuntimeCollectionProxy<T, any>((resolve, _reject) => {
        if (isPresent(opts.through)) {
          resolve({ holder, scope: runtimeScope });
        } else {
          resolve({ holder, scope: runtimeScope.where(foreignKeyData).toA() });
        }
      }, opts.klass);
      return collectionProxy;
    };

    // default
    if (opts.validate === undefined) opts.validate = true;
    if (opts.autosave === undefined) opts.autosave = true;

    /**
     * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_many
     */
    AssociationRegistry.create(this.name, AssociationList.hasMany, {
      [relationName]: {
        relationFn,
        saveStrategy: PersistenceStrategy.hasManySaveStrategyFn(relationName, opts),
        saveOrThrowStrategy: PersistenceStrategy.hasManySaveOrThrowStrategyFn(relationName, opts),
        destroyStrategy: PersistenceStrategy.hasManyDestroyStrategyFn(relationName, opts),
      },
    });
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

  /**
   * @see buildAssociationRecord
   */
  buildHasOneRecord<T extends ActiveRecord$Base, U extends rt.Record$Params>(
    relationName: string,
    params?: Partial<U>
  ): Promise<T> {
    return this.buildAssociationRecord(relationName, params);
  }

  /**
   * @alias buildAssociationRecord
   */
  buildBelongsToRecord<T extends ActiveRecord$Base, U extends rt.Record$Params>(
    relationName: string,
    params?: Partial<U>
  ): Promise<T> {
    return this.buildAssociationRecord(relationName, params);
  }

  buildAssociationRecord<T extends ActiveRecord$Base, U extends rt.Record$Params>(
    relationName: string,
    params?: Partial<U>
  ): Promise<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    /**
     * @description need to call hasOne relation once to set _associationCache
     */
    return _this[relationName]().then((existAssociationRecord) => {
      if (existAssociationRecord) existAssociationRecord.destroySync();
      const holder = _this._associationCache[relationName].associationHolder;
      const { recordKlass, foreignKeyData } = holder;
      const merged = Object.assign(params || {}, foreignKeyData);
      const record = new recordKlass(merged) as T;
      _this._associationCache[relationName].associationScope = [record];
      return record;
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
