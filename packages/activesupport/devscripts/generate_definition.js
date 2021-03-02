const path = require('path');
const { Generator$Definitions } = require('@rue/generator');

Generator$Definitions.generate(['src/**/*.ts', '!src/**/__tests__/*.test.ts'], {
  pkgName: 'activesupport',
  outputPath: '../../packages/definition/src/activesupport.json',
  cwd: path.resolve('.'),
});
