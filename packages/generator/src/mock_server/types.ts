export type MockServerHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type MockServerContentType = string;

export type MockServerData = {
  resource: string;
  request: {
    path: string;
    pathRegexp: string;
    method: MockServerHttpMethod;
    query?: Record<string, string | number>;
    queryRegexp?: string;
    body?: Record<string, any>;
  };
  response: {
    headers?: Record<string, string | number>;
    body: Record<string, any>;
  };
};

export type MockServerRoutes = {
  [method in MockServerHttpMethod]: {
    [uri: string]: {
      resource: string;
      count: number;
      paths: string[];
    };
  };
};

/**
 * @see https://github.com/recruit-tech/agreed
 */
export type MockServerAgreedData = {
  request: {
    path: string;
    method: MockServerHttpMethod;
    query?: Record<string, string>;
    body?: Record<string, any>;
  };
  response: {
    headers?: Record<string, string | number>;
    body: Record<string, any>;
  };
};
