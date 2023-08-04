import type FileContainer from './workspace/codebase/file';

export interface RandomObject extends Record<string, any> {}
export interface FilesContainer extends Record<string, FileContainer> {}

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
