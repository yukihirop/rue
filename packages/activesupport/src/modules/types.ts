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

export type RueModule = () => {} & {
  __rue_module__: true;
  __rue_ancestor_module__: Function;
  body: RueModuleBody;
  prototype: {
    [methodName: string]: Function;
  };
};

export type RueModuleBody = {
  instance?: {
    [methodName: string]: Function;
  };
  static?: {
    [methodName: string]: Function;
  };
};

export type RueModuleOptions = {
  only: string[];
};
