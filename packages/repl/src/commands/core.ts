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

// this is bound to an instance(class) of Repl(Builtin)
const commands: t.Commands = {
  ls: {
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
  lp: {
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
  proto: {
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
  desc: {
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
  ancs: {
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
  show: {
    help:
      '[Rue] Display method definition (format: <Class>.<staticMethod> or <Class>.prototype.<instanceMethod> or <Instance>.<method>)',
    action: function (objName: string) {
      const _this = this as replt.REPLServer;
      _this.clearBufferedCommand();

      if (objName) {
        let [maybeKlassName, maybeProto, methodName] = objName.split('.');
        
        const isStatic =
          typeof _this.context[maybeKlassName] === 'function' &&
          !maybeProto &&
          methodName == undefined;
        
        const isInstance =
          (typeof _this.context[maybeKlassName] === 'function' &&
            maybeProto &&
            methodName !== '') ||
          (typeof evalInContext(maybeKlassName, _this.context) === 'object' &&
            maybeProto &&
            methodName == undefined);

        if (isInstance || isStatic) {
          execAction(objName, _this, (obj) => {
            console.log(obj.toString());
          });
        } else {
          console.error(
            `'${objName}' is an unsupported format or does not exist on the REPL context.`
          );
        }
      } else {
        console.error(`'undefined' does not exist on the REPL context.`);
      }

      _this.displayPrompt();
    },
  },
};

export const defineCommands = (repl: replt.REPLServer) => {
  Object.entries(commands).forEach(([keyword, cmd]) => {
    repl.defineCommand(keyword, cmd);
  });
};
