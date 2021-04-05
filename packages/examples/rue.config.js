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
    loadModules: [
      'src/**/{forms,models,records}/**/*.ts',
      'src/setup/rc.ts',
      '!src/**/__tests__/*.test.{js,ts}',
    ],
    moduleAliases: {
      '@': './src',
    },
  },
};
