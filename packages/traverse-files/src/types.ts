export interface RandomObject extends Record<string, any> {}

export type CollectedFile = [string, string];
export type Directory = CollectedFile[];

export type Options = {
  src: string;
  extensions: string[];
  ignoredFiles: string[];
};
