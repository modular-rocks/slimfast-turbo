import { extractIdentifiers } from '../../extract-identifiers';

import type { ConstraintWithData } from '../../../../../types';

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
 * const result = isWithinRange(nodePath, data);
 * // Returns true if nodePath contains between 2 and 4 identifiers, inclusive.
 */
export const identifiersWithinRange: (
  min: number,
  max: number
) => ConstraintWithData<'toInject' | 'toImport'> =
  (min, max) =>
  /**
   * Determines if the number of identifiers within a given AST node path is within the specified range.
   *
   * @param path - The AST node path to be examined.
   * @param data - Information or context related to the node. The data should contain keys 'toImport' and 'toInject'.
   * @returns `true` if the number of identifiers lies within the specified range, otherwise `false`.
   */
  (path, data) => {
    extractIdentifiers(path, data);

    const minIdentifiers = min || 2;
    const maxIdentifiers = max || 4;

    const { length } = data.toInject;
    return length >= minIdentifiers && length <= maxIdentifiers;
  };
