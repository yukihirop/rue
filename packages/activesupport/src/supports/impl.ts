// functions
import { moduleExtend } from '@/modules';

// modules
import { InfoModule } from './modules';

class Impl {
  static getMethods: () => string[];
  static getProperties: () => string[];
}

interface Impl {}

// module extend
moduleExtend(Impl, InfoModule, { only: ['getMethods', 'getProperties'] });

export { Impl };
