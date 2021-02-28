export type RueConfig = {
  cli: {
    commands: {
      console: {
        nodeREPL: {
          prompt: string;
          useColors: boolean;
        };
      };
    };
  };
  repl: {
    loadModules: string[];
    moduleAliases: {
      [aliasName: string]: string;
    };
  };
};

export type RueNodeREPLConfig = RueConfig['cli']['commands']['console']['nodeREPL'];
export type RueRueREPLConfig = RueConfig['repl'];
