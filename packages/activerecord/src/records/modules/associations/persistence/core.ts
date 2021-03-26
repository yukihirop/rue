// rue packages
import { RueModule } from '@rue/activesupport';

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
  destroy<T extends ActiveRecord$Base>(): Promise<T | boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return _this._destroyAssociations<T>().then((result) => {
      if (isPresent(_this.errors['hasMany'] || isPresent(_this.errors['hasOne']))) {
        return false;
      } else {
        if (result.every(Boolean)) {
          return _this.destroySync();
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

    const allAssociationStrategies = AssociationRegistry.data[_this.constructor.name];

    return Promise.all(
      Object.keys(allAssociationStrategies).reduce((acc, associationName: AssociationList) => {
        const result = Object.keys(allAssociationStrategies[associationName]).map(
          (relationName: string) => {
            const destroyStrategy =
              allAssociationStrategies[associationName][relationName]['destroyStrategy'];
            if (destroyStrategy) {
              // @ts-expect-error
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
  save(opts?: { validate: boolean }): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;

    const allAssociationStrategies = AssociationRegistry.data[_this.constructor.name];

    return Promise.all(
      Object.keys(allAssociationStrategies)
        .map((associationName: AssociationList) => {
          return Object.keys(allAssociationStrategies[associationName]).map(
            (relationName: string) => {
              const saveStrategy =
                allAssociationStrategies[associationName][relationName]['saveStrategy'];
              if (saveStrategy) {
                if (associationName === AssociationList.belongsTo) {
                  const saveResultPromise = saveStrategy(_this) as Promise<boolean>;
                  return saveResultPromise.then((result) => {
                    if (result) {
                      if (_this.isNewRecord() || _this.isChanged()) {
                        return _this.saveSync(opts);
                      } else {
                        return _this.isValid();
                      }
                    } else {
                      return false;
                    }
                  });
                } else {
                  if (_this.isNewRecord() || _this.isChanged()) _this.saveSync(opts);
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
  saveOrThrow(opts?: { validate: boolean }): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;

    _this.saveSyncOrThrow();

    const allAssociationStrategies = AssociationRegistry.data[_this.constructor.name];

    return Promise.all(
      Object.keys(allAssociationStrategies)
        .map((associationName: AssociationList) => {
          return Object.keys(allAssociationStrategies[associationName]).map(
            (relationName: string) => {
              const saveOrThrowStrategy =
                allAssociationStrategies[associationName][relationName]['saveOrThrowStrategy'];
              if (saveOrThrowStrategy) {
                if (associationName === AssociationList.belongsTo) {
                  const saveResultPromise = saveOrThrowStrategy(_this) as Promise<boolean>;
                  return saveResultPromise
                    .then((reslult) => {
                      if (reslult) {
                        if (_this.isNewRecord() || _this.isChanged()) {
                          return _this.saveSyncOrThrow();
                        } else {
                          return _this.isValid();
                        }
                      } else {
                        return false;
                      }
                    })
                    .catch((err) => {
                      throw err;
                    });
                } else {
                  if (_this.isNewRecord() || _this.isChanged()) _this.saveSyncOrThrow();
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
