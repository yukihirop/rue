// rue packages
import { Model } from '@rue/activemodel';

// locals
import {
  registryForAssociations as Registry,
  cacheForIntermeditateTables as IntermediateTable,
} from '@/registries';
import { errObj, ErrCodes } from '@/errors';

// types
import * as t from './types';

export const enum Association {
  belongsTo = 'belongsTo',
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  hasAndBelongsToMany = 'hasAndBelongsToMany',
}

export class Core extends Model {
  public primaryKey: t.PrimaryKey;

  static belongsTo<T extends Core = any>(
    relationName: string,
    klass: Function,
    foreignKey: string
  ) {
    Registry.create(this.name, Association.belongsTo, {
      [relationName]: (self: T) => (klass as any).findBy({ primaryKey: self[foreignKey] }),
    });
  }

  static hasOne<T extends Core = any>(
    relationName: string,
    klass: Function,
    foreignKey: t.ForeignKey
  ) {
    Registry.create(this.name, Association.hasOne, {
      [relationName]: (self: T) => (klass as any).findBy({ [foreignKey]: self.primaryKey }),
    });
  }

  static hasMany<T extends Core = any>(
    relationName: string,
    klass: Function,
    foreignKey: t.ForeignKey
  ) {
    Registry.create(this.name, Association.hasMany, {
      [relationName]: (self: T) =>
        (klass as any).where({ [foreignKey]: self.primaryKey }).toPromiseArray(),
    });
  }

  static hasAndBelongsToMany<T extends Core = any>(relationName, klass: Function) {
    const foreignKeysFn = (self: T) => {
      const tables = IntermediateTable.read<[t.ForeignKey, t.ForeignKey][]>(
        this.name,
        klass.name,
        'array'
      );
      return tables.reduce((acc, pair) => {
        if (pair[0] == self.primaryKey) {
          acc.push(pair[1]);
        }
        return acc;
      }, []);
    };

    IntermediateTable.create(this.name, klass.name, []);
    Registry.create(this.name, Association.hasAndBelongsToMany, {
      [relationName]: (self: T) =>
        (klass as any).where({ primaryKey: foreignKeysFn(self) }).toPromiseArray(),
    });
  }

  hasAndBelongsToMany<T extends Core = any>(record: T): { [key: string]: t.ForeignKey } {
    const klassNameLeft = this.constructor.name;
    const klassNameRight = record.constructor.name;

    const tables = IntermediateTable.read<[t.ForeignKey, t.ForeignKey][]>(
      klassNameLeft,
      klassNameLeft,
      'array'
    );

    if (Array.isArray(tables)) {
      IntermediateTable.create(klassNameLeft, klassNameRight, [
        [this.primaryKey, record.primaryKey],
      ]);
      return { [klassNameLeft]: this.primaryKey, [klassNameRight]: record.primaryKey };
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

  releaseAndBelongsToMany<T extends Core = any>(record: T): { [key: string]: t.ForeignKey } {
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
        if (this.primaryKey == pair[0] && record.primaryKey == pair[1]) {
          deleteData.push(pair);
        } else {
          leavedData.push(pair);
        }
      });
      IntermediateTable.update(klassNameLeft, klassNameRight, leavedData);
      return { [klassNameLeft]: this.primaryKey, [klassNameRight]: record.primaryKey };
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

  protected defineAssociations() {
    const allAssociations = Registry.data[this.constructor.name];

    if (allAssociations == undefined) return;

    Object.keys(allAssociations).forEach((associationName: string) => {
      const relationData = allAssociations[associationName];

      Object.keys(relationData).forEach((relationName: string) => {
        const relationFn = relationData[relationName];

        Object.defineProperty(this, relationName, {
          enumerable: true,
          configurable: false,
          value: () => relationFn(this),
        });
      });
    });
  }
}
