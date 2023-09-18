import { describe, expect, test } from 'vitest';

import { storeDependencies } from '.';
import { Codebase as CodebaseBase } from '..';

import type { CodebaseOpts } from '../../../types';
import { FileHandlerCustom } from '../index.test';

const str = JSON.stringify;

class Codebase extends CodebaseBase<FileHandlerCustom> {
  constructor(opts: CodebaseOpts) {
    super(new FileHandlerCustom(), opts);
  }
}

describe('Store dependencie', () => {
  test('Everything works', async () => {
    const dependencyKeys = ['gems', 'packages'];
    const files: [string, string][] = [1, 2, 3].map((x: number) => [
      `/home/projects/project/path${x}`,
      '',
    ]);
    const pipeline: Function[] = [];

    const opts: CodebaseOpts = {
      pipeline,
      files,
      src: '/home/projects/project/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: { gems: { gem1: 'gem' } },
    };

    const codebase = new Codebase(opts);
    const dependencies = storeDependencies(codebase, dependencyKeys);
    expect(str(dependencies)).toBe(str(['gem1']));
  });
});
