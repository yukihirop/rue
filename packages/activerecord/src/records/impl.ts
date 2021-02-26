// rue packages
import { Support$ImplBase } from '@rue/activesupport';

// local
import { Record } from '@/records';
import { Association } from '@/associations';
import { PersistenceModule, FinderMethodsModule } from '@/records/modules';

// https://stackoverflow.com/questions/42999765/add-a-method-to-an-existing-class-in-typescript/43000000#43000000
abstract class ActiveRecord$Impl extends Association {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = Support$ImplBase.__rue_abstract_class__;

  // PersistennceModule
  static RECORD_ID = PersistenceModule.RECORD_ID;
  static RECORD_ALL = PersistenceModule.RECORD_ALL;
  static RECORD_AUTO_INCREMENNT_ID = PersistenceModule.RECORD_AUTO_INCREMENNT_ID;
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
PersistenceModule.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: ['save', 'saveOrThrow', 'destroy'],
});

// extend module
PersistenceModule.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: ['destroyAll', 'RECORD_AUTO_INCREMENNT_ID', 'RECORD_ID', 'RECORD_ALL'],
});
FinderMethodsModule.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['findBy'] });

export { ActiveRecord$Impl };
