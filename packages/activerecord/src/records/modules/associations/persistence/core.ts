// rue packages
import { RueModule } from '@ruejs/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { registryForAssociations as AssociationRegistry } from '@/registries';
import { isPresent } from '@/utils';

// enums
import { AssociationList } from '@/records/modules/associations';

export class ActiveRecord$Associations$Persistence extends RueModule {
  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-destroy
   */
  destroyWithAssociations<T extends ActiveRecord$Base>(): Promise<T | boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return _this._destroyAssociations<T>().then((result) => {
      if (isPresent(_this.errors['hasMany'] || isPresent(_this.errors['hasOne']))) {
        return false;
      } else {
        if (result.every(Boolean)) {
          return _this.destroy();
        } else {
          return false;
        }
      }
    });
  }

  protected _destroyAssociations<T extends ActiveRecord$Base>(): Promise<
    Array<T[] | boolean | number>
  > {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const allAssociationStrategies = AssociationRegistry.data[_this.uniqueKey];

    return Promise.all(
      Object.keys(allAssociationStrategies).reduce((acc, associationName: AssociationList) => {
        const result = Object.keys(allAssociationStrategies[associationName]).map(
          (relationName: string) => {
            const destroyStrategy =
              allAssociationStrategies[associationName][relationName]['destroyStrategy'];
            if (destroyStrategy) {
              // @ts-ignore
              return destroyStrategy(_this);
            }
          }
        );
        // @ts-expect-error
        acc.push(...result);
        return acc;
      }, [])
    ).then((associationDestroyResult) => {
      return associationDestroyResult;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Validations.html#method-i-save
   */
  saveWithAssociations(opts?: { validate: boolean }): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const allAssociationStrategies = AssociationRegistry.data[_this.uniqueKey];

    return Promise.all(
      Object.keys(allAssociationStrategies)
        .map((associationName: AssociationList) => {
          return Object.keys(allAssociationStrategies[associationName]).map(
            (relationName: string) => {
              const saveStrategy =
                allAssociationStrategies[associationName][relationName]['saveStrategy'];
              if (saveStrategy) {
                if (_this.isNewRecord() || _this.isChanged()) {
                  return _this.save(opts).then((result) => {
                    if (result) {
                      return saveStrategy(_this) as Promise<boolean>;
                    } else {
                      return Promise.resolve(false);
                    }
                  });
                } else {
                  return saveStrategy(_this) as Promise<boolean>;
                }
              }
            }
          );
        })
        .flat()
    ).then((associationSaveResult) => {
      return associationSaveResult.every(Boolean);
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Validations.html#method-i-save-21
   */
  saveWithAssociationsOrThrow(opts?: { validate: boolean }): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const allAssociationStrategies = AssociationRegistry.data[_this.uniqueKey];

    return Promise.all(
      Object.keys(allAssociationStrategies)
        .map((associationName: AssociationList) => {
          return Object.keys(allAssociationStrategies[associationName]).map(
            (relationName: string) => {
              const saveOrThrowStrategy =
                allAssociationStrategies[associationName][relationName]['saveOrThrowStrategy'];
              if (saveOrThrowStrategy) {
                if (_this.isNewRecord() || _this.isChanged()) {
                  return _this.saveOrThrow(opts).then((result) => {
                    if (result) {
                      return saveOrThrowStrategy(_this) as Promise<boolean>;
                    } else {
                      return Promise.resolve(false);
                    }
                  });
                } else {
                  return saveOrThrowStrategy(_this) as Promise<boolean>;
                }
              }
            }
          );
        })
        .flat()
    ).then((associationSaveResult) => {
      return associationSaveResult.every(Boolean);
    });
  }
}
