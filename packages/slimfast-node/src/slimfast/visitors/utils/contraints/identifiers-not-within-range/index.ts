import { identifiersWithinRange } from '../identifiers-within-range';

import type { RandomObject } from '../../../../../types';
import type { NodePath, Node } from '@babel/traverse';

/**
 * Generates a function to determine if the number of identifiers within an AST node path does not fall within a specified range.
 *
 * The created function leverages the `identifiersWithinRange` method and returns the opposite of its result, i.e., if `identifiersWithinRange` returns `true`, this function will return `false` and vice versa.
 *
 * @param min - The minimum number of identifiers the node should not contain (inclusive).
 * @param max - The maximum number of identifiers the node should not contain (inclusive).
 * @returns A function that evaluates if a node path contains identifiers outside the specified range.
 * @example
 * const isOutsideRange = identifiersNotWithinRange(2, 4);
 * const result = isOutsideRange(nodePath, data, opts, ast);
 * // Returns true if nodePath contains less than 2 or more than 4 identifiers.
 */
export const identifiersNotWithinRange =
  (min: number, max: number) =>
  /**
   * Determines if the number of identifiers within a given AST node path is outside the specified range.
   *
   * @param path - The AST node path to be examined.
   * @param data - Information or context related to the node.
   * @param opts - Configuration options influencing the check.
   * @param ast - The complete Abstract Syntax Tree.
   * @returns `true` if the number of identifiers lies outside the specified range, otherwise `false`.
   */
  (path: NodePath, data: RandomObject, opts: RandomObject, ast: Node) => {
    return !identifiersWithinRange(min, max)(path, data, opts, ast);
  };
