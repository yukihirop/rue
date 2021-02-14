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
