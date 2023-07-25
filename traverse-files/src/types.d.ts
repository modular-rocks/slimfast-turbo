declare module '@modular-rocks/traverse-files'

interface RandomObject extends Record<string, any> {}
type CollectedFile = [string, string] 

interface Options {
  src: string;
  extensions: string[];
  ignoredFiles: string[];
}

type Directory = CollectedFile[]