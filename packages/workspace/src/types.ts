import type { FileContainer } from './workspace/codebase/file/index.js';

export type RandomObject = Record<string, any>;
export type FilesContainer = Record<string, FileContainer>;

export type Options = {
  pipeline?: Function[];
  src: string;
  extensions: string[];
  ignoredFiles: string[];
  packageContents?: PackageContents;
  packagePath?: string;
  ignoredImports: string[];
  custom?: Custom;
  delay?: number;
  queued?: Boolean;
};

export type WorkspaceOpts = Options & {
  files?: [string, string][];
};

export type CodebaseOpts = Options & {
  files: [string, string][];
};

export type WorkspaceType = {
  opts: WorkspaceOpts;
};

export type Custom = {
  [property: string]: any;
};

export type State = {
  [property: string]: string;
};

export type ExtractedNodePath = [RandomObject, RandomObject];

export type FileStore = {
  [property: string]: any;
};

// Can take any shape, generally has to be an Object like Node packages
// Ports to any other languages can be formatted
export type PackageContents = {
  [property: string]: any;
};

export type OutputIteration = [number, number];
