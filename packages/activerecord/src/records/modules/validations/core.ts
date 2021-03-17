// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { registryForAssociations as AssociationRegistry } from '@/registries';

// enums
import { AssociationList } from '@/records/modules/associations';

// types
import * as rt from '@/registries/types';

export class ActiveRecord$Validations extends RueModule {
  saveAsync(opts?: { validate: boolean }): Promise<boolean> {
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

  saveAsyncOrThrow(opts?: { validate: boolean }): Promise<boolean> {
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
