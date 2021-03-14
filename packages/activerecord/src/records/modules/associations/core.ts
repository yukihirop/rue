// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Associations$Impl } from './impl';
import {
  registryForAssociations as AssociationRegistry,
  cacheForIntermeditateTables as IntermediateTable,
} from '@/registries';
import { errObj, ErrCodes } from '@/errors';

// types
import type * as ct from '@/types';
import type * as t from './types';
import type * as art from '@/records/relations/types';

export const enum Association {
  belongsTo = 'belongsTo',
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  hasAndBelongsToMany = 'hasAndBelongsToMany',
}

export class ActiveRecord$Associations extends ActiveRecord$Associations$Impl {
  public id: t.PrimaryKey;

  static belongsTo<T extends ActiveRecord$Base = any>(
    relationName: string,
    klass: Function,
    foreignKey: string
  ) {
    AssociationRegistry.create(this.name, Association.belongsTo, {
      [relationName]: (self: T) => (klass as any).findBy({ id: self[foreignKey] }),
    });
  }

  static hasOne<T extends ActiveRecord$Base = any>(
    relationName: string,
    klass: Function,
    foreignKey: t.ForeignKey
  ) {
    AssociationRegistry.create(this.name, Association.hasOne, {
      [relationName]: (self: T) => (klass as any).findBy({ [foreignKey]: self.id }),
    });
  }

  static hasMany<T extends ActiveRecord$Base>(
    relationName: string,
    klass: typeof ActiveRecord$Base,
    foreignKey: t.ForeignKey
  ) {
    AssociationRegistry.create(this.name, Association.hasMany, {
      [relationName]: (self: T) => {
        /**
         * @description I'm worried about the overhead, but load it dynamically to avoid circular references
         */
        const {
          ActiveRecord$Associations$CollectionProxy$Holder: Holder,
        } = require('../../associations/collection_proxy');

        const foreignKeyData = { [foreignKey]: self.id };
        const scope = klass.where<T>(foreignKeyData).toA();
        const holder = new Holder(klass, [], foreignKeyData);
        /**
         * @description Since it is a runtime specification, only any type can be given.
         */
        const collectionProxy = createRuntimeCollectionProxy<T, any>((resolve, _reject) => {
          resolve({ holder, scope });
          // @ts-expect-error
        }, klass);
        return collectionProxy;
      },
    });
  }

  static hasAndBelongsToMany<T extends ActiveRecord$Base = any>(relationName, klass: Function) {
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
    AssociationRegistry.create(this.name, Association.hasAndBelongsToMany, {
      [relationName]: (self: T) => (klass as any).where({ id: foreignKeysFn(self) }),
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

  static _defineAssociations<T extends ActiveRecord$Base = any>(self: T) {
    const allAssociations = AssociationRegistry.data[self.constructor.name];
    if (allAssociations == undefined) return;

    Object.keys(allAssociations).forEach((associationName: string) => {
      const relationData = allAssociations[associationName];

      Object.keys(relationData).forEach((relationName: string) => {
        const relationFn = relationData[relationName];

        Object.defineProperty(self, relationName, {
          enumerable: true,
          configurable: false,
          value: () => relationFn(self),
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
