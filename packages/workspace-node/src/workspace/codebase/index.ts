import { Codebase as CodebaseBase } from '@modular-rocks/workspace';

import { FileContainer, FileHandler } from './file';

import type { CodebaseOpts } from '../../types';

export class Codebase extends CodebaseBase<FileHandler> {
  constructor(opts: CodebaseOpts) {
    super(new FileHandler(), opts);
  }

  dependencyKeys(): string[] {
    return [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'bundledDependencies',
      'optionalDependencies',
    ];
  }

  newFile(path: string, code: string): FileContainer {
    return new FileContainer(path, code, this);
  }
}
