import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { tooSmall, getSize } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('"tooSmall" constraint function', () => {
  const code = `let computation = (5 * 6 - Math.pow(2, 3)) / (3 + 2) + Math.sqrt(16) - parseInt('101', 2);`;
  const ast = parser(code);
  let rootPath: NodePath | null = null;
  const data = {
    toInject: [],
    toImport: [],
  };

  traverse(ast, {
    Expression(path) {
      rootPath = path;
      path.stop();
    },
  });

  test('Node size evaluation with a high minimum length', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(1, 400, true)(rootPath, data);
    }
    expect(result).toBe(true);
  });

  describe('default Parameters', () => {
    const code = `let evaluation = (8 * 2 - Math.pow(3, 2)) / (7 % 3) + Math.sqrt(49) - parseFloat('5.67') + parseInt('1101', 2);`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    const data = {
      toInject: [],
      toImport: [],
    };

    traverse(ast, {
      Expression(path) {
        rootPath = path;
        path.stop();
      },
    });

    test('With undefined multiplier', () => {
      let result = false;
      if (rootPath !== null) {
        result = tooSmall(undefined, 50, true)(rootPath, data);
      }
      expect(result).toBe(false);
    });

    test('With undefined minLength', () => {
      let result = false;
      if (rootPath !== null) {
        result = tooSmall(2, undefined, true)(rootPath, data);
      }
      expect(result).toBe(false);
    });

    test('Without measurering identifiers', () => {
      let result = false;
      if (rootPath !== null) {
        result = tooSmall(2, 50, false)(rootPath, data);
      }
      expect(result).toBe(true);
    });

    test('With undefined measureIdentifiers', () => {
      let result = false;
      if (rootPath !== null) {
        result = tooSmall(2, 50, undefined)(rootPath, data);
      }
      expect(result).toBe(false);
    });
  });
});

describe('"getSize" utility function', () => {
  const code = 'sample;';
  const ast = parser(code);
  let rootPath: NodePath | null = null;

  traverse(ast, {
    Expression(path) {
      rootPath = path;
      path.stop();
    },
  });

  test('start as null', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, start: null };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('end as null', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, end: null };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('start as NaN', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, start: Number.NaN };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('end as NaN', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, end: Number.NaN };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('start as undefined', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, start: undefined };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('end as undefined', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, end: undefined };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });
});
