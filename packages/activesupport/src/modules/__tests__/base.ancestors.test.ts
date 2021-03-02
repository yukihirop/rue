import { RueModule, RueModuleAncestorController } from '../base';
import { registryForRueModule as Registry } from '@/registries';

describe('RueModule (Ancestors)', () => {
  // ActiveModel
  class ActiveModel$Validations extends RueModule {}
  class ActiveModel$Translation extends RueModule {}
  class ActiveModel$Impl {
    static __rue_impl_class__ = true;
  }
  ActiveModel$Translation.rueModuleIncludedFrom(ActiveModel$Impl, { only: [] });
  ActiveModel$Validations.rueModuleIncludedFrom(ActiveModel$Impl, { only: [] });
  class ActiveModel$Base extends ActiveModel$Impl {}

  // ActiveRecord
  class ActiveRecord$FinderMethods extends RueModule {}
  class ActiveRecord$Associations$CollectionProxy extends RueModule {}
  class ActiveRecord$Associations$Impl extends RueModule {
    static __rue_impl_class__ = true;
  }
  ActiveRecord$Associations$CollectionProxy.rueModuleExtendedFrom(ActiveRecord$Associations$Impl, {
    only: [],
  });
  // RueModule include RueModule pattern
  class ActiveRecord$Associations extends ActiveRecord$Associations$Impl {}
  class ActiveRecord$Persistence extends RueModule {}
  class ActiveRecord$Impl extends ActiveModel$Base {
    static __rue_impl_class__ = true;
  }
  ActiveRecord$Persistence.rueModuleIncludedFrom(ActiveRecord$Impl, { only: [] });
  ActiveRecord$Associations.rueModuleIncludedFrom(ActiveRecord$Impl, { only: [] });
  ActiveRecord$Persistence.rueModuleExtendedFrom(ActiveRecord$Impl, { only: [] });
  ActiveRecord$FinderMethods.rueModuleExtendedFrom(ActiveRecord$Impl, { only: [] });
  ActiveRecord$Associations.rueModuleExtendedFrom(ActiveRecord$Impl, { only: [] });
  class ActiveRecord$Base extends ActiveRecord$Impl {}
  class ActiveRecord extends ActiveRecord$Base {}

  const controller = new RueModuleAncestorController(ActiveRecord);

  it('should correctly', () => {
    expect(controller.data).toEqual([]);
    expect(controller.ancestors().map((r) => r['name'])).toEqual(['ActiveRecord']);
    expect(Registry.data['ActiveRecord$Impl']['__rue_ancestors__'].map((r) => r['name'])).toEqual([
      'ActiveRecord$Persistence',
      'ActiveRecord$Associations',
      'ActiveRecord$FinderMethods',
    ]);
  });
});
