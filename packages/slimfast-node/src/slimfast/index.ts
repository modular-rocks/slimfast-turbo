import { Codebase } from '@modular-rocks/workspace-node';
import { SlimFast as SlimFastBase } from '@modular-rocks/slimfast';

import { ExpressionVisitor } from './visitors/expression';
import { defaultFunctionNameGenerator } from './pipeline/name/default-function-name-generator';
import { builder as pipelineBuilder } from './pipeline/build/builder';
import { extract } from './pipeline/extract';
import { build } from './pipeline/build';
import { name } from './pipeline/name';

import type { SlimFastOpts } from '../types';

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
    const visitors: any[] = opts.visitors || [ExpressionVisitor];
    const namer: Function = opts.namer || defaultFunctionNameGenerator(0);
    const builder: Function = opts.builder || pipelineBuilder;
    const pipeline: Function[] = opts.pipeline?.length
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
