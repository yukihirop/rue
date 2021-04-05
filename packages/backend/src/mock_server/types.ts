export type AgreedServerOptions = {
  path?: string;
  port: number | string;
  enablePreferQuery?: boolean;
};

export type MockServerHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type MockServerRoute = {
  method: MockServerHttpMethod;
  resource: string;
  uri: string;
  count: number;
};
