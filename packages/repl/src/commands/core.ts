import { REPLServer } from 'repl';
// rue packages
import { Support } from '@rue/activesupport';

// locals
import { Repl } from '@/repl';

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

      try {
        let obj = _this.context[objName];
        if (!obj) obj = evalInContext(objName, _this.context);
        console.log(Support.getMethodsWithNamespace(obj));
      } catch (e) {
        console.error(e);
      }

      _this.displayPrompt();
    },
  },
  lp: {
    help: '[Rue] Display property list',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      try {
        let obj = _this.context[objName];
        if (!obj) obj = evalInContext(objName, _this.context);
        console.log(Support.getProperties(obj));
      } catch (e) {
        console.error(e);
      }

      _this.displayPrompt();
    },
  },
  proto: {
    help: '[Rue] Display Object.getPrototypeOf result',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      try {
        let obj = _this.context[objName];
        if (!obj) obj = evalInContext(objName, _this.context);
        console.log(Object.getPrototypeOf(obj));
      } catch (e) {
        console.error(e);
      }

      _this.displayPrompt();
    },
  },
  desc: {
    help: '[Rue] Display Object.getOwnPropertyDescriptors result',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      try {
        let obj = _this.context[objName];
        if (!obj) obj = evalInContext(objName, _this.context);
        console.log(Object.getOwnPropertyDescriptors(obj));
      } catch (e) {
        console.error(e);
      }

      _this.displayPrompt();
    },
  },
  ancs: {
    help: '[Rue] Display ancestors (like Ruby)',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      try {
        let obj = _this.context[objName];
        if (!obj) obj = evalInContext(objName, _this.context);
        console.log(Support.getAncestors(obj));
      } catch (e) {
        console.error(e);
      }

      _this.displayPrompt();
    },
  },
  loaded: {
    help: '[Rue] Display loaded Classes or RueModules',
    action: async function () {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      const modules = await Repl.loadRueModules();
      console.log(Object.keys(modules));

      _this.displayPrompt();
    },
  },
};

export const defineCommands = (repl: replt.REPLServer) => {
  Object.entries(commands).forEach(([keyword, cmd]) => {
    repl.defineCommand(keyword, cmd);
  });
};
