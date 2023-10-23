import type { RandomObject } from '../../../../../types';
import type { NodePath, Node } from '@babel/traverse';

const notANumber = (num: number | null | undefined): boolean =>
  num === null || num === undefined || Number.isNaN(num);

const getSize = (node: Node): number => {
  const start = node.start as number;
  const end = node.end as number;

  return notANumber(start) || notANumber(end) ? 0 : end - start;
};

/**
 * Generates a function to check if an AST node is "too small" based on size and associated identifiers.
 *
 * @param multiplier - Factor used for calculating minimum size from identifiers' length. Defaults to 1.5.
 * @param minLength - Minimum length threshold for the node. Defaults to 50.
 * @param measureIdentifiers - Whether to compare node size against identifier-based size. Defaults to true.
 * @returns A function that evaluates if a node path is "too small".
 * @example
 * const isNodeTooSmall = tooSmall(1.5, 50, true);
 * const small = isNodeTooSmall(nodePath, data, opts, ast);
 * // Returns true if node is too small.
 */
export const tooSmall =
  (multiplier: number, minLength: number, measureIdentifiers?: Boolean) =>
  /**
   * Evaluates if an AST node path is "too small" based on its size and associated identifiers.
   *
   * @param path - The AST node path under evaluation.
   * @param data - Information about the node, especially `toInject` which lists associated identifiers.
   * @param opts - Configuration options influencing the check.
   * @param ast - The complete Abstract Syntax Tree.
   * @returns `true` if the node path is "too small", otherwise `false`.
   */
  (path: NodePath, data: RandomObject, opts: RandomObject, ast: Node) => {
    multiplier = multiplier || 1.5;
    minLength = minLength || 50;
    measureIdentifiers = measureIdentifiers || true;

    const size = getSize(path.node);

    if (size < minLength) return true;

    if (!measureIdentifiers) return true;

    const identifiers = data.toInject.map((x: RandomObject) => x.name);
    const min = identifiers.join('').length * multiplier;

    return size < min;
  };
