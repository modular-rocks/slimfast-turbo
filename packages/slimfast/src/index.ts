import { Codebase, Workspace } from '@modular-rocks/workspace';

import type {
  Codebase as CodebaseType,
  FileHandler,
} from '@modular-rocks/workspace';
import type {
  CodebaseOpts,
  Options,
} from '@modular-rocks/workspace/dist/types/types';

export default class SlimFast<
  T extends FileHandler = FileHandler,
> extends Workspace {
  original: CodebaseType;

  refactored: CodebaseType;

  fileHandler: T;

  constructor(fileHandler: T, opts: CodebaseOpts) {
    super(opts);
    this.fileHandler = fileHandler;
    this.original = this.newCodeBase(opts);
    this.refactored = this.newCodeBase(opts);
  }

  newCodeBase(opts: CodebaseOpts) {
    return new Codebase(this.fileHandler, opts);
  }

  defaultOptions(opts: Options) {
    const pipeline: Function[] = opts.pipeline || [];
    this.opts = {
      ...opts,
      pipeline,
    };
    return this.opts;
  }

  async run() {
    const opts = this.defaultOptions(this.opts);
    const files = this.refactored.extractFiles();
    await this.pipeline(files, opts.pipeline, opts);
  }

  async save() {
    await this.refactored.save();
  }
}
