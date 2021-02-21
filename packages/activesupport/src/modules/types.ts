// e.g.)
// {
//   isModule: true,
//   create(){ / * something */ },
//   update(){ /* something */ },
// }
export type Module = {
  [methodName: string]: any;
} & {
  isModule: boolean;
};

export type ModuleOptions = {
  only: string[];
};

export interface IRueModule extends Function {
  __rue_module__: true;
  __rue_ancestor__: Function;
  body: RueModuleBody;
  constant?: RueModuleBody['constant'];
  static?: RueModuleBody['static'];
  instance?: RueModuleBody['instance'];
}

export type RueModuleBody = {
  constant?: {
    [propName: string]: any;
  };
  instance?: {
    [propName: string]: Function;
  };
  static?: {
    [propName: string]: Function;
  };
};

export type RueModuleOptions = {
  only: string[];
};
