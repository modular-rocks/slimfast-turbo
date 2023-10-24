import type { ConstraintWithData } from '../../../../../types';
import type { Node } from '@babel/traverse';

const notANumber = (num: number | null | undefined): boolean =>
  num === null || num === undefined || Number.isNaN(num);

const getSize = (node: Node): number => {
  const start = node.start as number;
  const end = node.end as number;

  return notANumber(start) || notANumber(end) ? 0 : end - start;
};

/**
 * Generates a function to determine if removing a given AST node would reduce the overall size of the AST too significantly.
 *
 * This is based on a comparison of the size of the node (measured in characters from start to end) and the size of the entire AST. If the node's size, when multiplied by a provided multiplier, exceeds the total size of the AST, then it is considered as removing too much.
 *
 * @param multiplier - Factor by which the size of the node is multiplied.
 * @returns A function that checks if the removal of a node path would reduce the AST size too significantly.
 * @example
 * const wouldRemoveTooMuch = removesTooMuch(2);
 * const significantReduction = wouldRemoveTooMuch(nodePath, data, opts, ast);
 * // Returns true if the removal would be too significant.
 */
export const removesTooMuch: (
  multiplier: number
) => ConstraintWithData<'ast'> =
  (multiplier) =>
  /**
   * Determines if the removal of a specific AST node would lead to a disproportionate reduction in the overall size of the AST.
   *
   * @param path - The AST node path under evaluation.
   * @param data - Information or context related to the node.
   * @param opts - Configuration options influencing the check.
   * @param ast - The complete Abstract Syntax Tree.
   * @returns `true` if the removal of the node would cause a significant reduction in the AST's size, otherwise `false`.
   */
  (path, data) => {
    const astSize = getSize(data.ast);
    const size = getSize(path.node);

    return size * multiplier > astSize;
  };
