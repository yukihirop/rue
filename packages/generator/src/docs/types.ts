export type MethodData = {
  [methodName: string]: {
    text: string;
    highlightText: string;
    isAsync: boolean;
    isAbstract: boolean;
    visibility: 'private' | 'public' | 'protected';
    line: [number, number];
  };
};

export type ClassDoc = {
  [className: string]: {
    metadata: {
      filePath: string;
      updatedAt: string;
    };
    instance?: MethodData;
    static?: MethodData;
  };
};

export type GlobbyFilePaths = string[];
export type GlobbyCurrentDirectoryPath = string;
