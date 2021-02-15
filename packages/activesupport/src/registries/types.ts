export type RegistryData<T> = {
  [klassName: string]: T;
};

export type RegistryType = 'array' | 'object' | 'value';

export type RegistryValue =
  | {
      [key: string]: any;
    }
  | any[]
  | any;
