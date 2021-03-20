// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { registryForAssociations as AssociationRegistry } from '@/registries';

// enums
import { AssociationList } from '@/records/modules/associations';

// types
import * as rt from '@/registries/types';

export class ActiveRecord$Associations$Persistence extends RueModule {
  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-destroy
   */
  destroy<T extends ActiveRecord$Base>(): Promise<T | boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return _this._destroyAssociations<T>().then(() => {
      if (Object.values(_this.errors['hasMany'] || {}).length > 0) {
        return false;
      } else {
        return _this.destroySync();
      }
    });
  }

  protected _destroyAssociations<T extends ActiveRecord$Base>(): Promise<
    Array<T[] | boolean | number>
  > {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // save hasMany association records
    const hasManyStrategies = AssociationRegistry.read<rt.AssociationsData>(
      _this.constructor.name,
      AssociationList.hasMany,
      'object'
    );
    return Promise.all(
      Object.keys(hasManyStrategies).map((relationName: string) => {
        if (hasManyStrategies[relationName]['destroyStrategy']) {
          const destroyStrategy = hasManyStrategies[relationName][
            'destroyStrategy'
          ] as rt.AssociationsHasManyValue['destroyStrategy'];
          // @ts-expect-error
          return destroyStrategy<T>(_this);
        }
      })
    ).then((associationDestroyResult) => {
      return associationDestroyResult;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Validations.html#method-i-save
   */
  save(opts?: { validate: boolean }): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;

    _this.saveSync(opts);

    // save hasMany association records
    const hasManyStrategies = AssociationRegistry.read<rt.AssociationsData>(
      _this.constructor.name,
      AssociationList.hasMany,
      'object'
    );
    return Promise.all(
      Object.keys(hasManyStrategies).map((relationName: string) => {
        if (hasManyStrategies[relationName]['saveStrategy']) {
          const saveStrategy = hasManyStrategies[relationName][
            'saveStrategy'
          ] as rt.AssociationsHasManyValue['saveStrategy'];
          return saveStrategy(_this) as Promise<boolean>;
        }
      })
    ).then((associationSaveResult) => {
      return associationSaveResult.every(Boolean);
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Validations.html#method-i-save-21
   */
  saveOrThrow(opts?: { validate: boolean }): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;

    _this.saveSyncOrThrow();

    // save hasMany association records
    const hasManyStrategies = AssociationRegistry.read<rt.AssociationsData>(
      _this.constructor.name,
      AssociationList.hasMany,
      'object'
    );

    return Promise.all(
      Object.keys(hasManyStrategies).map((relationName: string) => {
        if (hasManyStrategies[relationName]['saveStrategy']) {
          const saveOrThrowStrategy = hasManyStrategies[relationName][
            'saveOrThrowStrategy'
          ] as rt.AssociationsHasManyValue['saveOrThrowStrategy'];
          return saveOrThrowStrategy(_this) as Promise<boolean>;
        }
      })
    ).then((associationSaveResult) => {
      return associationSaveResult.every(Boolean);
    });
  }
}
