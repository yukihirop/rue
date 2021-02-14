// local
import { Record } from '@/records';
import { Association } from '@/associations';
import { moduleExtend, moduleInclude } from '@/utils';
import { PersistenceModule, FinderMethodsModule } from '@/records/modules';

// https://stackoverflow.com/questions/42999765/add-a-method-to-an-existing-class-in-typescript/43000000#43000000
class Impl extends Association {
  // PersistennceModule
  static destroyAll: <T extends Record>(filter?: (self: T) => boolean) => T[];
  // FinderMethodsModule
  static findBy: <T extends Record>(params: { [key: string]: any }) => Promise<T>;
}

interface Impl {
  // PersistenceModule
  save(): boolean;
  saveOrThrow(): void | boolean;
  destroy(): Record;
}

// includes module
moduleInclude(Impl, PersistenceModule, { only: ['save', 'saveOrThrow', 'destroy'] });

// extend module
moduleExtend(Impl, PersistenceModule, { only: ['destroyAll'] });
moduleExtend(Impl, FinderMethodsModule, { only: ['findBy'] });

// deletgate constants
Impl['RECORD_AUTO_INCREMENNT_ID'] = PersistenceModule.RECORD_AUTO_INCREMENNT_ID;
Impl['RECORD_ID'] = PersistenceModule.RECORD_ID;
Impl['RECORD_ALL'] = PersistenceModule.RECORD_ALL;

export { Impl };
