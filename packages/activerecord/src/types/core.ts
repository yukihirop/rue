import type * as mt from '@rue/activemodel';

// https://github.com/Microsoft/TypeScript/issues/204#issuecomment-257722306
// https://stackoverflow.com/a/44989194/9434894
export type Constructor<T> = { new (...args: any[]): T };
export type valueOf<T> = T[keyof T];

export type I18nConfig = mt.Model$I18nConfig;
