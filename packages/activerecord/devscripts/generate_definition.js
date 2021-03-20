const path = require('path');
const { Generator$Definitions } = require('@rue/generator');

Generator$Definitions.generate(['src/**/*.ts', '!src/**/__tests__/**/*.test.ts'], {
  pkgName: 'activerecord',
  outputPath: '../../packages/definition/src/activerecord.json',
  cwd: path.resolve('.'),
});
