import { containsIdentifiersInOtherScopes } from '../utils/contraints/contains-identifiers-in-other-scopes';
import { hasAssignmentExpression } from '../utils/contraints/has-assignment-expression';
import { hasBlocklistedIdentifiers } from '../utils/contraints/has-blocklisted-identifiers';
import { hasReturnStatement } from '../utils/contraints/has-return-statement';
import { hasVariableDeclarator } from '../utils/contraints/has-variable-declarator';
import { identifiersNotWithinRange } from '../utils/contraints/identifiers-not-within-range';
import { removesTooMuch } from '../utils/contraints/removes-too-much';
import { shouldIgnore } from '../utils/contraints/should-ignore';
import { tooSmall } from '../utils/contraints/too-small';
import { Visitor } from '../visitor';

import type { Constraints } from '../../../types';

/**
 * A `Visitor` that traverses AST expression nodes, evaluating them against specific constraints.
 */
export class ExpressionVisitor extends Visitor {
  /**
   * Provides a list of constraint functions for evaluating expressions during AST traversal.
   *
   * @returns An array of constraint functions specific to expressions.
   */
  constraints(): Constraints {
    return [
      removesTooMuch(2),
      shouldIgnore,
      hasBlocklistedIdentifiers([]),
      identifiersNotWithinRange(2, 4),
      tooSmall(50, 1.5, true),
      hasReturnStatement,
      hasVariableDeclarator,
      containsIdentifiersInOtherScopes,
      hasAssignmentExpression,
    ];
  }

  /**
   * This method is focused on AST nodes of type 'Expression'. For each node encountered during traversal, the method checks if it contains nested expressions. If not, it evaluates the node using the `test` method to determine if it meets the set criteria.
   *
   * @returns An object detailing how to process 'Expression' nodes during AST traversal.
   */
  visit() {
    const test = this.test.bind(this);
    return {
      Expression(path: any) {
        let containsExpressions = false;
        path.traverse({
          Expression() {
            containsExpressions = true;
          },
        });
        if (!containsExpressions) {
          test(path);
        }
      },
    };
  }
}
