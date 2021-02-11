export type ErrMessage = {
  message?: string | Function;
};

export interface ErrObj extends Error {
  code: string;
  namespace: string;
  message: string;
}
