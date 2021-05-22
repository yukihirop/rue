require('dotenv').config();

module.exports = {
  backend: {
    mock_server: {
      loadData: ['./backend/mock_server/data/**/*.{js,json}'],
      dist: {
        db: './backend/mock_server/db.json',
        routes: './backend/mock_server/routes.json',
      },
    },
  },
  cli: {
    commands: {
      console: {
        nodeREPL: {
          prompt: '🍛 > ',
          useColors: true,
        },
      },
    },
  },
  repl: {
    ruePackageRootPath: process.env.RUE_PKG_ROOT_PATH,
    actions: {
      ancestors: 'ancs',
      descriptors: 'desc',
      loadedModules: 'loaded',
      propertyList: 'lp',
      methodList: 'ls',
      prototype: 'proto',
      definition: 'show',
    },
    dotEnvPath: './.env.dev',
    loadModules: [
      'src/**/{forms,models,records}/**/*.ts',
      '!src/rue/{forms,models,records}/**',
      'src/setup/rc.ts',
      '!src/**/__tests__/*.test.{js,ts}',
    ],
    moduleAliases: {
      '@': './src',
    },
  },
};
