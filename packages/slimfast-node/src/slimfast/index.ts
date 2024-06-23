import { SlimFast as SlimFastBase } from '@modular-rocks/slimfast';
import { Codebase } from '@modular-rocks/workspace-node';

import { build } from './pipeline/build';
import { builder as pipelineBuilder } from './pipeline/build/builder';
import { extract } from './pipeline/extract';
import { name } from './pipeline/name';
import { defaultFunctionNameGenerator } from './pipeline/name/default-function-name-generator';
import { ExpressionVisitor } from './visitors/expression';

import type { SlimFastOpts } from '../types';
import type { Visitor } from './visitors/visitor';

/**
 * It represents a workspace that contains both the original and refactored
 * versions of a codebase. It offers methods to manage the
 * codebase configurations.
 */
export class SlimFast extends SlimFastBase {
  /**
   * Initializes the SlimFast instance with the given configuration options.
   *
   * @param opts - Configuration options for the SlimFast instance.
   *
   * @example
   * const slimfast = new SlimFast({ src: './src' });
   */
  constructor(opts: SlimFastOpts) {
    super(opts);
  }

  /**
   * Returns a new Codebase instance with the given configuration options.
   *
   * @param opts - Configuration options for the new Codebase instance.
   * @returns A new Codebase instance.
   */
  newCodeBase(opts: SlimFastOpts) {
    return new Codebase(opts);
  }

  /**
   * Merges the provided configuration options with default pipeline options.
   * Ensures that the configuration has default values for `visitors`, `namer`,
   * `builder`, and `pipeline` if they are not provided.
   *
   * @param opts - The configuration options to be merged with default ones.
   * @returns The merged configuration options containing both original and default values.
   */
  defaultOptions(opts: SlimFastOpts) {
    super.defaultOptions(opts);
    const visitors: (typeof Visitor)[] = opts.visitors || [ExpressionVisitor];
    const namer = opts.namer || defaultFunctionNameGenerator(0);
    const builder = opts.builder || pipelineBuilder;
    const pipeline = opts.pipeline?.length
      ? opts.pipeline
      : [extract(visitors), name(namer), build(builder)];
    return {
      ...opts,
      visitors,
      namer,
      builder,
      pipeline,
    };
  }
}
