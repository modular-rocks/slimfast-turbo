import type { FileContainer } from './workspace/codebase/file/index.js';
import type { Workspace } from './workspace/index.js';

export type RandomObject = Record<string, any>;
export type FilesContainer = Record<string, FileContainer>;

export type Options<T = unknown, W = Workspace> = {
  pipeline?: PossiblyAsyncFunc<T, W>[];
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

export type WorkspaceOpts<T = unknown, W = Workspace> = Options<T, W> & {
  files?: [string, string][];
};

export type CodebaseOpts<T = unknown, W = Workspace> = Options<T, W> & {
  files: [string, string][];
};

export type WorkspaceType<T = unknown, W = Workspace> = {
  opts: WorkspaceOpts<T, W>;
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

export type PossiblyAsyncFunc<T, W = Workspace> = (
  file: FileContainer,
  state: State,
  opts: WorkspaceOpts<T, W>,
  workspace: W
) => Promise<T> | T;
