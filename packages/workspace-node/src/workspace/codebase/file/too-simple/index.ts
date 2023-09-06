import { File } from '@babel/types';
import {
  loc,
  maintainability,
  totalCyclomaticComplexity,
} from '@modular-rocks/metrics-ts-js';

type MetricOpts = {
  code?: string;
  ast?: File;
  minLoc?: number;
  minMaintainability?: number;
};

type Opts = {
  loc?: Boolean;
  complexity?: Boolean;
  maintainability?: Boolean;
  metricOpts: MetricOpts;
};

type Scores = {
  loc?: number;
  complexity?: number;
  maintainability?: number;
};

/**
 * Determines the quality metrics for a code string.
 *
 * @param opts - Object of metrics options.
 *  - [loc] - boolean, use or don't use the loc metric.
 *  - [complexity] - boolean, use or don't use the complexity metric.
 *  - [maintainability] - boolean, use or don't use the maintainability metric.
 *  - [code] - in string format
 *  - [ast] - in AST format
 *  - any other options defined in https://github.com/modular-rocks/metrics-ts-js
 * @returns an object of scores.
 *
 * @example
 * const opts = {
 *   loc: true, // lines of code
 *   complexity: true,
 *   maintainability: true,
 *   code: 'console.log("hello world")',
 * };
 * const scores = measure(opts);
 * console.log(scores);
 * // Outputs: { loc: 1, complexity: 0, maintainability: 100 }
 */
export const measure = (opts: Opts) => {
  const scores: Scores = {};

  if (opts.loc) scores.loc = loc(opts.metricOpts);
  if (opts.complexity)
    scores.complexity = totalCyclomaticComplexity(opts.metricOpts);
  if (opts.maintainability)
    scores.maintainability = maintainability(opts.metricOpts);

  return scores;
};

/**
 * Determines if a file is simple and doesn't require refactoring.
 *
 * @param metricOpts - Object of metrics options.
 *  - [minLoc] - minimum lines of code length.
 *  - [minMaintainability] - minimum maintainability score.
 *  - [code] - in string format
 *  - [ast] - in AST format
 *  - any other options defined in https://github.com/modular-rocks/metrics-ts-js
 * @returns true or false based on the metrics.
 *
 * @example
 * const metricOptions = {
 *   minLoc: 5,
 *   minMaintainability: 70,
 *   code: 'console.log("hello world")'
 * };
 * const isSimple = tooSimple(metricOptions);
 * console.log(isSimple);
 * // Outputs: true or false based on the metrics
 */
export const tooSimple = (metricOpts: MetricOpts) => {
  const scores = measure({ loc: true, maintainability: true, metricOpts });
  const minLoc = metricOpts.minLoc || 50;
  const minMaintainability = metricOpts.minMaintainability || 95;
  return Boolean(
    (scores.loc && scores.loc < minLoc) ||
      (scores.maintainability && scores.maintainability > minMaintainability)
  );
};
