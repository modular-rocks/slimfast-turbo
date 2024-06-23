import { describe, expect, test } from 'vitest';
import { isCallExpression } from '@babel/types';

import { SlimFast, Visitor } from '.';
import {
  containsIdentifiersInOtherScopes,
  hasAssignmentExpression,
  hasBlocklistedIdentifiers,
  hasReturnStatement,
  hasVariableDeclarator,
  identifiersNotWithinRange,
  identifiersWithinRange,
  isAFunction,
  removesTooMuch,
  shouldIgnore,
  tooSmall,
} from './exports/constraints';
import {
  generateExportedFunction,
  generateExportedJSXComponent,
  generateFunction,
  generateImportDeclaration,
  generateJSXElement,
  hasAwait,
  replace,
  wrap,
} from './exports/generator';
import {
  build,
  builder,
  combineImports,
  extract,
  name,
} from './exports/pipeline';
import {
  unique,
  defaultFunctionNameGenerator,
  uniqueImmutable,
} from './exports/utils';
import {
  ExpressionVisitor as ExportedExpressionVisitor,
  Visitor as ExportedVisitor,
  extractIdentifiers,
  notInExtracted,
  parser,
  rejectParentsWithTypes,
} from './exports/visitors';

describe('Module exports', () => {
  test('should export SlimFast', () => {
    expect(SlimFast).toBeDefined();
  });

  test('should export Visitor', () => {
    expect(Visitor).toBeDefined();
  });

  describe('constrains module exports', () => {
    test('should export containsIdentifiersInOtherScopes', () => {
      expect(containsIdentifiersInOtherScopes).toBeDefined();
    });

    test('should export hasAssignmentExpression', () => {
      expect(hasAssignmentExpression).toBeDefined();
    });

    test('should export hasBlocklistedIdentifiers', () => {
      expect(hasBlocklistedIdentifiers).toBeDefined();
    });

    test('should export hasReturnStatement', () => {
      expect(hasReturnStatement).toBeDefined();
    });

    test('should export hasVariableDeclarator', () => {
      expect(hasVariableDeclarator).toBeDefined();
    });

    test('should export identifiersNotWithinRange', () => {
      expect(identifiersNotWithinRange).toBeDefined();
    });

    test('should export identifiersWithinRange', () => {
      expect(identifiersWithinRange).toBeDefined();
    });

    test('should export isAFunction', () => {
      expect(isAFunction).toBeDefined();
    });

    test('should export isCallExpression', () => {
      expect(isCallExpression).toBeDefined();
    });

    test('should export removesTooMuch', () => {
      expect(removesTooMuch).toBeDefined();
    });

    test('should export shouldIgnore', () => {
      expect(shouldIgnore).toBeDefined();
    });

    test('should export tooSmall', () => {
      expect(tooSmall).toBeDefined();
    });
  });

  describe('generator module exports', () => {
    test('should export generateImportDeclaration', () => {
      expect(generateImportDeclaration).toBeDefined();
    });

    test('should export generateJSXElement', () => {
      expect(generateJSXElement).toBeDefined();
    });

    test('should export generateFunction', () => {
      expect(generateFunction).toBeDefined();
    });

    test('should export replace', () => {
      expect(replace).toBeDefined();
    });

    test('should export hasAwait', () => {
      expect(hasAwait).toBeDefined();
    });

    test('should export generateExportedJSXComponent', () => {
      expect(generateExportedJSXComponent).toBeDefined();
    });

    test('should export generateExportedFunction', () => {
      expect(generateExportedFunction).toBeDefined();
    });

    test('should export wrap', () => {
      expect(wrap).toBeDefined();
    });
  });

  describe('pipeline module exports', () => {
    test('should export combineImports', () => {
      expect(combineImports).toBeDefined();
    });

    test('should export builder', () => {
      expect(builder).toBeDefined();
    });

    test('should export build', () => {
      expect(build).toBeDefined();
    });

    test('should export extract', () => {
      expect(extract).toBeDefined();
    });

    test('should export name', () => {
      expect(name).toBeDefined();
    });
  });

  describe('utils module exports', () => {
    test('should export unique', () => {
      expect(unique).toBeDefined();
    });

    test('should export uniqueImmutable', () => {
      expect(uniqueImmutable).toBeDefined();
    });

    test('should export defaultFunctionNameGenerator', () => {
      expect(defaultFunctionNameGenerator).toBeDefined();
    });
  });

  describe('visitors module exports', () => {
    test('should export ExpressionVisitor', () => {
      expect(ExportedExpressionVisitor).toBeDefined();
    });

    test('should export Visitor', () => {
      expect(ExportedVisitor).toBeDefined();
    });

    test('should export extractIdentifiers', () => {
      expect(extractIdentifiers).toBeDefined();
    });

    test('should export notInExtracted', () => {
      expect(notInExtracted).toBeDefined();
    });

    test('should export parser', () => {
      expect(parser).toBeDefined();
    });

    test('should export rejectParentsWithTypes', () => {
      expect(rejectParentsWithTypes).toBeDefined();
    });
  });
});
