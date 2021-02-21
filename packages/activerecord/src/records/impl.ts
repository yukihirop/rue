// rue packages
import { Support } from '@rue/activesupport';

// local
import { Record } from '@/records';
import { Association } from '@/associations';
import { PersistenceModule, FinderMethodsModule } from '@/records/modules';

// https://stackoverflow.com/questions/42999765/add-a-method-to-an-existing-class-in-typescript/43000000#43000000
class ActiveRecord$Impl extends Association {
  // PersistennceModule
  static destroyAll: <T extends Record>(filter?: (self: T) => boolean) => T[];
  // FinderMethodsModule
  static findBy: <T extends Record>(params: { [key: string]: any }) => Promise<T>;
}

interface ActiveRecord$Impl {
  // PersistenceModule
  save(): boolean;
  saveOrThrow(): void | boolean;
  destroy(): Record;
}

// includes module
Support.rueModuleInclude(ActiveRecord$Impl, PersistenceModule, {
  only: ['save', 'saveOrThrow', 'destroy'],
});

// extend module
Support.rueModuleExtend(ActiveRecord$Impl, PersistenceModule, { only: ['destroyAll'] });
Support.rueModuleExtend(ActiveRecord$Impl, FinderMethodsModule, { only: ['findBy'] });

// deletgate constants
ActiveRecord$Impl['RECORD_AUTO_INCREMENNT_ID'] =
  PersistenceModule.constant.RECORD_AUTO_INCREMENNT_ID;
ActiveRecord$Impl['RECORD_ID'] = PersistenceModule.constant.RECORD_ID;
ActiveRecord$Impl['RECORD_ALL'] = PersistenceModule.constant.RECORD_ALL;

export { ActiveRecord$Impl };
