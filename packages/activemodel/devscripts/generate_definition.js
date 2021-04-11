const path = require('path');
const { Generator$Definitions } = require('@ruejs/generator');

Generator$Definitions.generate(
  ['src/**/*.ts', '!src/**/__tests__/*.test.ts', '!src/**/validators/**/*.ts'],
  {
    pkgName: 'activemodel',
    outputPath: '../../packages/definition/src/activemodel.json',
    cwd: path.resolve('.'),
  }
);
