import { Codebase } from '@modular-rocks/workspace-node';
import { SlimFast as SlimFastBase } from '@modular-rocks/slimfast';

import { ExpressionVisitor } from './visitors/expression';
import { defaultFunctionNameGenerator } from './pipeline/name/default-function-name-generator';
import { builder as pipelineBuilder } from './pipeline/build/builder';
import { extract } from './pipeline/extract';
import { build } from './pipeline/build';
import { name } from './pipeline/name';

import type { SlimFastOpts } from '../types';

export class SlimFast extends SlimFastBase {
  constructor(opts: SlimFastOpts) {
    super(opts);
  }

  newCodeBase(opts: SlimFastOpts) {
    return new Codebase(opts);
  }

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
