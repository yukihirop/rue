// https://github.com/Microsoft/TypeScript/issues/204#issuecomment-257722306
export type Constructor<T> = { new (...args: any[]): T } | ((...args: any[]) => T) | Function;
