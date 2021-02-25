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
    outputPath: 'src/docs.json',
    cwd: path.resolve('.')
  })
