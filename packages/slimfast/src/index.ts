import { Codebase, Workspace } from '@modular-rocks/workspace';

import type { Codebase as CodebaseType } from '@modular-rocks/workspace';
import type { CodebaseOpts, Options } from '@modular-rocks/workspace/types';

/**
 * The SlimFast class extends the Workspace class and represents a workspace that
 * contains both the original and refactored versions of a codebase.
 */
export class SlimFast extends Workspace {
  /**
   * The original version of the codebase.
   */
  original: CodebaseType;

  /**
   * The refactored version of the codebase.
   */
  refactored: CodebaseType;

  /**
   * Initializes the SlimFast instance with the given configuration options.
   * It creates instances for the original and refactored codebases.
   *
   * @param opts - Configuration options for the SlimFast instance.
   *
   * @example
   * const slimFast = new SlimFast({
   *   src: './src',
   *   extensions: ['.js', '.ts'],
   *   ignoredFiles: ['ignoreMe.js'],
   *   packagePath: './package.json',
   *   ignoredImports: ['specific-import'],
   *   custom: { customConfig: true }
   * });
   */
  constructor(opts: CodebaseOpts) {
    super(opts);
    this.original = this.newCodeBase(opts);
    this.refactored = this.newCodeBase(opts);
  }

  /**
   * Returns a new Codebase instance with the given configuration options.
   *
   * @param opts - Configuration options for the new Codebase instance.
   * @returns A new Codebase instance.
   */
  newCodeBase(opts: CodebaseOpts) {
    return new Codebase(opts);
  }

  /**
   * Sets the `opts` property of the SlimFast instance based on the provided `opts`.
   * If no pipeline is provided in the options, an empty array is used.
   *
   * @param opts The options to be merged with the current ones.
   * @returns The updated options.
   *
   * @example
   * const slimFastInstance = new SlimFast(someConfig);
   * const newOpts = {
   *   src: './newSrc',
   *   extensions: ['.jsx'],
   *   ignoredFiles: ['doNotInclude.js']
   * };
   * const updatedOpts = slimFastInstance.defaultOptions(newOpts);
   */
  defaultOptions(opts: Options) {
    const pipeline: Function[] = opts.pipeline || [];
    this.opts = { ...opts, pipeline };
    return this.opts;
  }

  /**
   * Executes the pipeline for the refactored codebase.
   *
   * Processes each file of the refactored codebase using the pipeline
   * specified in the instance options. The method ensures that the options are up-to-date,
   * extracts the files from the refactored codebase, and then processes these files through
   * the pipeline.
   *
   * @returns A promise that resolves once the pipeline processing completes.
   *
   * @example
   * const slimfast = new SlimFast({
   *   src: './src',
   *   pipeline: [
   *     (file, state, opts, workspace) => {
   *      console.log(`Processing: ${file.name}`);
   *    }
   *   ]
   * });
   *
   * await slimfast.run();
   * // This would log "Processing: [filename]" for each file in the refactored codebase.
   */
  async run() {
    const opts = this.defaultOptions(this.opts);
    const files = this.refactored.extractFiles();
    await this.pipeline(files, opts.pipeline, opts);
  }

  /**
   * Saves the refactored version of the codebase to the file system.
   *
   * Iterates over all the extracted files from the refactored codebase and
   * saves each file to its specified location on the file system with its associated content.
   *
   * @returns A promise that resolves once all files of the refactored codebase
   * have been saved to the file system.
   *
   * @example
   * const slimfast = new SlimFast({ src: './src' });
   *
   * // After performing some operations on the refactored codebase...
   * await slimfast.run();
   * await slimfast.save();
   * // All changes made to the refactored codebase are now saved to the file system.
   */
  async save() {
    await this.refactored.save();
  }
}
