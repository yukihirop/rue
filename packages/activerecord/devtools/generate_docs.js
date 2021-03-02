const path = require('path');
const { Generator$Docs } = require('@rue/generator');

Generator$Docs.generate(['src/**/*.ts', '!src/**/__tests__/*.test.ts'], {
  pkgName: 'activerecord',
  outputPath: '../../packages/definition/src/activerecord.json',
  cwd: path.resolve('.'),
});
