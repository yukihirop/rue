module.exports = {
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
      '!src/**/__tests__/*.test.{js,ts}'
    ],
    moduleAliases: {
      '@': './src',
    },
  },
};
