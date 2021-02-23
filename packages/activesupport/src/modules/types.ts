export interface IRueModule extends Function {
  readonly __rue_description__: string;
  readonly __rue_module__: true;
  __rue_ancestor__: Function | IRueModule;
  __rue_last_ancestor_module__?: IRueModule;
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
