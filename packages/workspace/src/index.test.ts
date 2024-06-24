import { describe, expect, test } from 'vitest';
import { Codebase, FileContainer, Workspace, pipeline } from '.';

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

  test('should export pipeline', () => {
    expect(pipeline).toBeDefined();
  });
});
