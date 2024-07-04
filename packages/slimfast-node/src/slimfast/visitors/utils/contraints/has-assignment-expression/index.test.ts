import traverse from '@babel/traverse';
import { describe, expect, test } from 'vitest';

import { hasAssignmentExpression, isUsedInPath } from './index';
import { parser } from '../../parser';

import type { NodePath } from '@babel/traverse';
import type { AssignmentExpression } from '@babel/types';

describe('Has assignment expression', () => {
  test('Has variables used in the path', () => {
    const code = `let myvar = 'yes'; 
                  myvar = 'no';
                  console.log(myvar);`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      enter(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath);
      expect(result).toBe(true);
    }
  });

  test('Variable is not used in path', () => {
    const code = `let myvar = 'yes'; 
                  {
                    myvar = 'no';
                  }
                  {
                    console.log(myvar);
                  }`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      BlockStatement(path) {
        rootPath = path;
        path.stop();
      },
    });

    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath);
      expect(result).toBe(false);
    }
  });

  test('Has variables used in the path', () => {
    const code = `function outerFunction() {
                    let myvar = 'yes'; 
                    myvar = 'no';
                    function innerfunction() {
                      console.log(myvar);
                    }
                    innerfunction();
                  }
                  outerfunction();`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      enter(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath);
      expect(result).toBe(true);
    }
  });

  test('Has variables (ObjectPattern) used in the path', () => {
    const code = `let c, d;
                  ({ c, d } = obj);
                  console.log(a, b, c, d);
                  `;

    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      enter(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath);
      expect(result).toBe(true);
    }
  });

  test('The path passed is an assigment expression', () => {
    const code = `yes = 'no'`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;

    traverse(ast, {
      AssignmentExpression(path) {
        rootPath = path;
        path.stop();
      },
    });
    if (rootPath !== null) {
      const result = hasAssignmentExpression(rootPath);
      expect(result).toBe(true);
    }
  });

  test('isInsideFunction returns false when the variable is not defined in the scope', () => {
    const code = `function example() {
                    let a = 1;
                    if (a > 0) {
                      a = 2;
                    }
                  }`;
    const ast = parser(code);
    let rootPath: NodePath | null = null;
    let variablePath: NodePath<AssignmentExpression> | null = null;

    traverse(ast, {
      BlockStatement(path) {
        rootPath = path;
        path.stop();
      },
    });

    traverse(ast, {
      AssignmentExpression(path) {
        const { left } = path.node;
        if (left.type === 'Identifier' && left.name === 'a') {
          variablePath = path;
          path.stop();
        }
      },
    });

    let result = true;

    if (rootPath !== null && variablePath !== null) {
      result = isUsedInPath('b', variablePath, rootPath);
    }

    expect(result).toBe(false);
  });
});
