import {
  loc,
  maintainability,
  totalCyclomaticComplexity,
} from '@modular-rocks/metrics-ts-js';
import { isFile } from '@babel/types';

import type { File } from '@babel/types';
import type { Constraint } from '../../../../../types.js';

type MetricOpts = {
  code?: string;
  ast?: File;
  minLoc?: number;
  minMaintainability?: number;
};

type Opts = {
  loc?: boolean;
  complexity?: boolean;
  maintainability?: boolean;
  metricOpts: MetricOpts;
};

type Scores = {
  loc?: number;
  complexity?: number;
  maintainability?: number;
};

/**
 * Measures quality metrics based on provided options.
 *
 * @param opts - Options to enable metrics (loc, complexity, maintainability) plus metricOpts.
 * @returns An object with the computed scores.
 *
 * @example
 * const scores = measure({
 *   loc: true,
 *   maintainability: true,
 *   metricOpts: { code: 'console.log("hello")', minLoc: 50, minMaintainability: 95 },
 * });
 * // Might return: { loc: 1, maintainability: 100 }
 */
const measure = (opts: Opts): Scores => {
  const scores: Scores = {};

  if (opts.loc) scores.loc = loc(opts.metricOpts);
  if (opts.complexity)
    scores.complexity = totalCyclomaticComplexity(opts.metricOpts);
  if (opts.maintainability)
    scores.maintainability = maintainability(opts.metricOpts);

  return scores;
};

/**
 * Constraint that determines if a file is too simple and therefore doesn’t require refactoring.
 *
 * The file is considered too simple if:
 * - Its lines of code (loc) is less than a minimum threshold (default is 50), OR
 * - Its maintainability score is greater than a threshold (default is 95).
 *
 * The function retrieves the file’s code and AST from the node path’s hub (if available),
 * computes the metrics, and then returns `true` if either condition is met.
 *
 * @param path - The AST node path representing the file.
 * @returns `true` if the file is too simple; otherwise, `false`.
 *
 * @example
 * const isTooSimple = tooSimple(nodePath);
 * if (isTooSimple) {
 *   // Skip further refactoring or analysis.
 * }
 */
export const tooSimple: Constraint = (path) => {
  const code = path.scope.getProgramParent().path.toString();
  const ast = path.scope.getProgramParent().path.parent;

  if (!isFile(ast)) {
    console.log('Expected parent node to be of type File');
    return false;
  }

  const minLoc = 50;
  const minMaintainability = 95;

  const metricOpts: MetricOpts = {
    code,
    ast,
    minLoc,
    minMaintainability,
  };

  const scores = measure({ loc: true, maintainability: true, metricOpts });

  return (
    (scores.loc !== undefined && scores.loc < minLoc) ||
    (scores.maintainability !== undefined &&
      scores.maintainability > minMaintainability)
  );
};
