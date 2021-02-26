const path = require('path');
const { Generator$Docs } = require('@rue/generator');

Generator$Docs.generate(
  [
    'src/**/*.ts',
    '!src/**/__tests__/*.test.ts',
    '!src/**/validators/**/*.ts'
  ],
  {
    pkgName: 'activemodel',
    outputPath: '../../packages/docs/src/activemodel.json',
    cwd: path.resolve('.')
  })
