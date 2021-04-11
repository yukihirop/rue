import { REPLServer } from 'repl';
// rue packages
import { ActiveSupport$Base as Support } from '@ruejs/activesupport';
import { Config$Base as Config } from '@ruejs/config';

// locals
import { Repl$Base as Repl } from '@/repl';
import { Repl$Commands$Definitions } from './definitions';

// types
import * as t from './types';
import * as replt from 'repl';

// https://stackoverflow.com/questions/8403108/calling-eval-in-particular-context
function evalInContext(str: string, context: any) {
  return function () {
    try {
      return eval(`this.${str}`);
    } catch (e) {
      console.error(e);
    }
  }.call(context);
}

function execAction(objName: string, repl: replt.REPLServer, callback: (obj: any) => any) {
  try {
    let obj = repl.context[objName];
    if (!obj) obj = evalInContext(objName, repl.context);
    if (obj) {
      callback(obj);
    } else {
      console.error(`'${objName}' does not exist on the REPL context.`);
    }
  } catch (e) {
    console.error(e);
  }
}

const defaultAliases = Config.default.repl.actions;
const udfAliases = Config.rueREPL().actions;
const useAliases = Object.keys(defaultAliases).reduce((acc, key) => {
  const defaultValue = defaultAliases[key];
  const udfValue = udfAliases[key];
  acc[key] = udfValue && udfValue != '' ? udfValue : defaultValue;
  return acc;
}, {} as typeof udfAliases);

// this is bound to an instance(class) of Repl(Builtin)
const commands: t.Commands = {
  [useAliases.methodList]: {
    help: '[Rue] Display method list',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      execAction(objName, _this, (obj) => {
        console.log(Support.getMethodsWithNamespace(obj));
      });

      _this.displayPrompt();
    },
  },
  [useAliases.propertyList]: {
    help: '[Rue] Display property list',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      execAction(objName, _this, (obj) => {
        console.log(Support.getProperties(obj));
      });

      _this.displayPrompt();
    },
  },
  [useAliases.prototype]: {
    help: '[Rue] Display Object.getPrototypeOf result',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      execAction(objName, _this, (obj) => {
        console.log(Object.getPrototypeOf(obj));
      });

      _this.displayPrompt();
    },
  },
  [useAliases.descriptors]: {
    help: '[Rue] Display Object.getOwnPropertyDescriptors result',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      execAction(objName, _this, (obj) => {
        console.log(Object.getOwnPropertyDescriptors(obj));
      });

      _this.displayPrompt();
    },
  },
  [useAliases.ancestors]: {
    help: '[Rue] Display ancestors (like Ruby)',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      execAction(objName, _this, (obj) => {
        console.log(Support.getAncestors(obj));
      });

      _this.displayPrompt();
    },
  },
  [useAliases.loadedModules]: {
    help: '[Rue] Display loaded Classes or RueModules',
    action: async function () {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      const modules = await Repl.loadRueModules();
      console.log(Object.keys(modules));

      _this.displayPrompt();
    },
  },
  [useAliases.definition]: {
    help:
      '[Rue] Display method definition (format: <Class> or <Class>.<staticMethod> or <Class>.prototype.<instanceMethod>)',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      Repl$Commands$Definitions.displayDefinition(objName, _this);

      _this.displayPrompt();
    },
  },
};

export const defineCommands = (repl: replt.REPLServer) => {
  Object.entries(commands).forEach(([keyword, cmd]) => {
    repl.defineCommand(keyword, cmd);
  });
};
