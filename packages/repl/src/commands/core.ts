// rue packages
import { Support } from '@rue/activesupport';

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

// this is bound to an instance(class) of Repl(Builtin)
const commands: t.Commands = {
  ls: {
    help: '[Rue] Display method list',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      let obj = _this.context[objName];
      if (!obj) obj = evalInContext(objName, _this.context);
      console.log(Support.getMethodsWithNamespace(obj));

      _this.displayPrompt();
    },
  },
  lp: {
    help: '[Rue] Display property list',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      let obj = _this.context[objName];
      if (!obj) obj = evalInContext(objName, _this.context);
      console.log(Support.getProperties(obj));

      _this.displayPrompt();
    },
  },
};

export const defineCommands = (repl: replt.REPLServer) => {
  Object.entries(commands).forEach(([keyword, cmd]) => {
    repl.defineCommand(keyword, cmd);
  });
};
