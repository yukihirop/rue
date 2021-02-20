export type Command = {
  help: string;
  action: (...args) => void | Promise<void>;
};

export type Commands = {
  [keyword: string]: Command;
};
