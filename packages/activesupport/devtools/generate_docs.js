const path = require('path');
const { Generator$Docs } = require('@rue/generator');

Generator$Docs.generate(['src/**/*.ts', '!src/**/__tests__/*.test.ts'], {
  pkgName: 'activesupport',
  outputPath: '../../packages/definition/src/activesupport.json',
  cwd: path.resolve('.'),
});
