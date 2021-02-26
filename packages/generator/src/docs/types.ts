export type DeclarationData = {
  [methodName: string]: {
    text: string;
    highlightText: string;
    line: [number, number];
    isAsync?: boolean;
    isAbstract?: boolean;
    visibility?: 'private' | 'public' | 'protected';
  };
};

export type MethodData = Required<DeclarationData>;

export type ClassDoc = {
  [className: string]: {
    metadata: {
      filePath: string;
      updatedAt: string;
    };
    class: DeclarationData;
    $constructor?: MethodData;
    instance?: MethodData;
    static?: MethodData;
  };
};

export type GlobbyFilePaths = string[];
export type GlobbyCurrentDirectoryPath = string;
