import { basename, dirname, join } from 'path';

import type Codebase from '..';
import type FileContainer from '../file';

export default (codebase: Codebase, file: FileContainer) => {
  const filename = basename(file.pathname);

  const filenamePieces = filename.split('.');
  const subfolder = filenamePieces[0];

  if (subfolder === 'index') {
    return file.pathname;
  }

  const directory = dirname(file.pathname);
  const newExtension = filenamePieces.slice(1).join('.');
  const newSrc = join(directory, subfolder, `index.${newExtension}`);
  codebase.files[newSrc] = codebase.files[file.pathname];
  delete codebase.files[file.pathname];
  file.pathname = newSrc;

  return newSrc;
};
