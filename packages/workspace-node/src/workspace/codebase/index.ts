import { Codebase as CodebaseBase } from '@modular-rocks/workspace';

import type { CodebaseOpts } from '@modular-rocks/workspace/dist/types/types';

import FileContainer from './file';

export default class Codebase extends CodebaseBase {
  constructor(opts: CodebaseOpts) {
    super(opts);
  }

  dependencyKeys(): string[] {
    return ['dependencies', 'devDependencies', 'peerDependencies', 'bundledDependencies', 'optionalDependencies'];
  }

  newFile(path: string, code: string): FileContainer {
    return new FileContainer(path, code, this);
  }
}
