import { describe, expect, test } from 'vitest';

import { SlimFast } from '.';
import before from '../../test-results/basic/before';
import after from '../../test-results/basic/after';

import type { SlimFastOpts } from '../types';

const code = before;

describe('Slimfast Node', () => {
  test('It modularises', async () => {
    const files: [string, string][] = [[`/path`, code]];
    const opts: SlimFastOpts = {
      files,
      src: '/',
      extensions: [],
      ignoredFiles: [],
      ignoredImports: [],
      packageContents: {},
    };

    const slimFast = new SlimFast(opts);
    await slimFast.run();
    const newFiles = slimFast.refactored.extractFiles();
    const file = newFiles[0];
    expect(file.code).toBe(after);
    expect(newFiles.length).toBe(20);
  }, 30000);
});
