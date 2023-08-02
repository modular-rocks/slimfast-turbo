export interface RandomObject extends Record<string, any> {}
export interface FilesContainer extends Record<string, FileContainerType> {}

export type Options = {
  pipeline?: Function[];
  src: string;
  extensions: string[];
  ignoredFiles: string[];
  packageContents?: PackageContents;
  packagePath?: string;
  ignoredImports: string[];
  custom?: Custom;
};

export interface WorkspaceOpts extends Options {
  files?: [string, string][];
}

export interface CodebaseOpts extends Options {
  files: [string, string][];
}

export type WorkspaceType = {
  opts: WorkspaceOpts;
};

export type CodebaseType = {
  src: string;
  extensions: string[];
  ignoredFiles: string[];
  ignoredImports: string[];
  files: FilesContainer;
  rootName: string;
  srcWithoutRoot: string;
  package: PackageContents;
  dependencies: string[];
  opts: Options;
  replaceRoot: Function;
  saveFile: Function;
  fromJson: Function;
  extractFiles: Function;
  save: Function;
  addFile: Function;
  makeDirectory: Function;
};

// TODO: Use more explicit types (avoid the use of Function)
export type FileContainerType = {
  pathname: string;
  fullPath: string;
  type?: string;
  code: string;
  simple: Boolean;
  hasParent: Boolean;
  codebase: CodebaseType;
  store: FileStore;
  ast?: any;
  parse: Function;
  updateCode: Function;
  print: Function;
  astToCode: Function;
  codeToAST: Function;
  spawn: Function;
  tooSimple: Function;
  addImport: (importStatement?: any) => boolean;
  save: Function;
};

export type Custom = {
  [propter: string]: any;
};

export type State = {
  [property: string]: string;
};

export type ExtractedNodePath = [RandomObject, RandomObject];

export type FileStore = {
  [property: string]: any;
};

// Can take any shape, generately has to be an Object like Node packages
// Ports to any other languages can be formatted
export type PackageContents = {
  [property: string]: any;
};

export type OutputIteration = [number, number];
