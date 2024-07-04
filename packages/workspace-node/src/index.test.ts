import { describe, expect, test } from 'vitest';
import { Codebase, FileContainer, Workspace } from './index.js';

describe('Module Exports', () => {
  test('should export Codebase', () => {
    expect(Codebase).toBeDefined();
  });

  test('should export FileContainer', () => {
    expect(FileContainer).toBeDefined();
  });

  test('should export Workspace', () => {
    expect(Workspace).toBeDefined();
  });
});
