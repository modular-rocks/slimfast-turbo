import { Codebase as CodebaseBase } from '@modular-rocks/workspace';

import { FileContainer } from './file/index.js';

import type { CodebaseOpts } from '../../types.js';

export class Codebase extends CodebaseBase {
  constructor(opts: CodebaseOpts) {
    super(opts);
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
