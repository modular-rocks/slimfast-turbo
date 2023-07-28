import { extname, basename, posix } from 'path';

import { read, resolve, readFilesInDirectory, isDirectory } from './convenience';

import type { Directory, Options, RandomObject } from './types';

const removeExtensions = (extensions: string[]) => (fullpath: string) => {
  return extensions.includes(extname(fullpath).replace('.', ''));
};

const removeIgnoredExtensions = (ignoredExtensions: string[]) => (fullpath: string) => {
  return !ignoredExtensions.map((ex: string) => fullpath.includes(ex)).filter(Boolean)[0];
};

const removeTests = (fullpath: string) => !basename(fullpath).match(/test/);

function traverse(directory: string, files: string[]): string[] {
  const accumulatedFiles: string[] = [...files];

  readFilesInDirectory(directory).forEach((filePath: string) => {
    const absolutePath: string = posix.join(directory, filePath);
    if (isDirectory(absolutePath)) {
      // If it's a directory, call traverse recursively and update the accumulatedFiles
      accumulatedFiles.push(...traverse(absolutePath, []));
    } else {
      // If it's a file, add the absolute path to the accumulatedFiles
      accumulatedFiles.push(absolutePath);
    }
  });

  return accumulatedFiles; // Return the new array with all file paths
}

const collect = (path: string, extensions: string[], ignoredExtensions: string[], ignoreTests: Boolean) => {
  const files: string[] = traverse(path, []);

  let output = files.filter(removeExtensions(extensions)).filter(removeIgnoredExtensions(ignoredExtensions));

  if (ignoreTests) {
    output = output.filter(removeTests);
  }

  return output;
};

const readDirectory = (opts: Options): Directory => {
  const { src, extensions, ignoredFiles } = opts;

  const files: [string, string][] = [];
  const readFiles: string[] = collect(src, extensions, ignoredFiles, true);

  readFiles.forEach((path: string) => {
    files.push([path, read(path)]);
  });

  return files;
};

const readJSONFile = (packagePath: string): RandomObject => {
  return JSON.parse(read(packagePath));
};

export {
  read,
  resolve,
  collect,
  traverse,
  removeTests,
  readJSONFile,
  readDirectory,
  removeExtensions,
  removeIgnoredExtensions,
};
