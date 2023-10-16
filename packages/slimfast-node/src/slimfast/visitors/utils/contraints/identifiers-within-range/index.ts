import { NodePath, Node } from '@babel/traverse';
import { extractIdentifiers } from '../../extract-identifiers';

import type { RandomObject } from '../../../../../types';

/**
 * Generates a function to determine if the number of identifiers within an AST node path falls within a specified range.
 *
 * The created function first extracts identifiers from the provided node path using the `extractIdentifiers` method. After extraction, it checks if the count of identifiers lies within the provided `min` and `max` range.
 *
 * @param min - The minimum number of identifiers the node should contain (inclusive). Defaults to 2.
 * @param max - The maximum number of identifiers the node should contain (inclusive). Defaults to 4.
 * @returns A function that evaluates if a node path contains identifiers within the specified range.
 * @example
 * const isWithinRange = identifiersWithinRange(2, 4);
 * const result = isWithinRange(nodePath, data, opts, ast);
 * // Returns true if nodePath contains between 2 and 4 identifiers, inclusive.
 */
export const identifiersWithinRange =
  (min: number, max: number) =>
  /**
   * Determines if the number of identifiers within a given AST node path is within the specified range.
   *
   * @param path - The AST node path to be examined.
   * @param data - Information or context related to the node.
   * @param opts - Configuration options influencing the check.
   * @param ast - The complete Abstract Syntax Tree.
   * @returns `true` if the number of identifiers lies within the specified range, otherwise `false`.
   */
  (path: NodePath, data: RandomObject, opts: RandomObject, ast: Node) => {
    extractIdentifiers(path, data, opts, ast);

    const minIdentifiers = min || 2;
    const maxIdentifiers = max || 4;

    const { length } = data.toInject;
    return length >= minIdentifiers && length <= maxIdentifiers;
  };
