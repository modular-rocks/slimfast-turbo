import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { tooSmall, getSize } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';

describe('Default Parameters', () => {
  const code = `let result = ((2 + 3) * 4 - Math.sqrt(9)) / (6 % 2) + Math.pow(2, 5) - parseFloat('10.5') + parseInt('100', 2);`;
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

  test('Node size evaluation with default parameters', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(2, 50, true)(rootPath, data);
    }
    expect(result).toBe(false);
  });

  test('Node size evaluation with higher multiplier', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(4, 50, true)(rootPath, data);
    }
    expect(result).toBe(false);
  });
});

describe('Higher Minimum Length', () => {
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

  test('Node size evaluation with higher minimum length', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(1, 400, true)(rootPath, data);
    }
    expect(result).toBe(true);
  });
});

describe('Node with null or NaN properties', () => {
  const code = `let calculation = Math.pow(3, 3) - (5 / 2) + parseFloat('12.34') - Math.sqrt(25);`;
  const ast = parser(code);
  let rootPath: NodePath | null = null;

  traverse(ast, {
    Expression(path) {
      rootPath = path;
      path.stop();
    },
  });

  test('Node size evaluation with start as null', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, start: null } as any;
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('Node size evaluation with end as null', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, end: null };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('Node size evaluation with start as NaN', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, start: Number.NaN };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('Node size evaluation with end as NaN', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, end: Number.NaN };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('Node size evaluation with start as undefined', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, start: undefined };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });

  test('Node size evaluation with end as undefined', () => {
    let result = 0;
    if (rootPath !== null) {
      const node = { ...rootPath.node, end: undefined };
      result = getSize(node);
    }
    expect(result).toBe(0);
  });
});

describe('Undefined Parameters', () => {
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

  test('Node size evaluation with undefined multiplier', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(undefined, 50, true)(rootPath, data);
    }
    expect(result).toBe(false);
  });

  test('Node size evaluation with undefined minLength', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(2, undefined, true)(rootPath, data);
    }
    expect(result).toBe(false);
  });

  test('Node size evaluation with undefined measureIdentifiers', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(2, 50, false)(rootPath, data);
    }
    expect(result).toBe(true);
  });

  test('Node size evaluation with undefined measureIdentifiers', () => {
    let result = false;
    if (rootPath !== null) {
      result = tooSmall(2, 50, undefined)(rootPath, data);
    }
    expect(result).toBe(false);
  });
});
