import { readDirectory } from '@modular-rocks/traverse-files';

import { pipeline as runPipeline } from './pipeline';

import type { FileContainer } from './codebase/file';
import type { WorkspaceOpts } from '../types';

export class Workspace {
  /**
   * Configuration options for the Workspace instance. It dictates how the workspace
   * should operate and what kind of files or actions it should consider or ignore.
   * For instance, it can define the source directory, file extensions to consider,
   * files to ignore, pipeline functions to apply, and other custom configurations.
   *
   * @example
   * {
   *   src: './src',
   *   extensions: ['.js', '.ts'],
   *   ignoredFiles: ['ignoreMe.js'],
   *   packagePath: './package.json',
   *   ignoredImports: ['specific-import'],
   *   custom: { customConfig: true }
   * }
   *  */
  opts: WorkspaceOpts;

  /**
   * By default, if no files are provided in the options,
   * the constructor will use the `defaultLoader` method
   * to populate the `files` based on the provided directory options.
   *
   * @param opts - Configuration options for the Workspace instance.
   *
   * @example
   * const workspace = new Workspace({
   *   src: './src',
   *   extensions: ['.js', '.ts'],
   *   ignoredFiles: ['ignoreMe.js'],
   *   packagePath: './package.json',
   *   ignoredImports: ['specific-import'],
   *   custom: { customConfig: true }
   * });
   */
  constructor(opts: WorkspaceOpts) {
    this.defaultLoader(opts);
    this.opts = opts;
  }

  /**
   * Loads files from a specified directory if the `files` option is not provided.
   *
   * @param opts - Configuration options for loading files into the Workspace.
   *
   * @example
   * const workspace = new Workspace({ src: './src' });
   * // Assuming there are no files specified in opts,
   * // the defaultLoader would be triggered to populate them based on the 'src' directory.
   */
  defaultLoader(opts: WorkspaceOpts) {
    if (!opts.files) {
      opts.files = readDirectory(opts);
    }
  }

  /**
   * Processes files through a series of functions, forming a pipeline. The pipeline method
   * offers a structured approach to sequentially process each file using a chain of functions,
   * supporting both synchronous and asynchronous operations. Each function in the pipeline has
   * access to shared data or configuration options, allowing for flexible file processing within
   * the context of a workspace.
   *
   * @param files - Array of file containers to be processed.
   * @param pipeline - An array of functions that each file should be processed through.
   * @param opts - Configuration options for processing.
   * @returns Promise resulting from the pipeline execution.
   *
   * @example
   * const workspace = new Workspace({ src: './src' });
   * const myPipeline = [
   *   (file, state, opts, workspace) => { console.log(file.name); }
   * ];
   *
   * const filesToProcess = [...]; // Assume an array of FileContainer objects.
   * workspace.pipeline(filesToProcess, myPipeline, workspace.opts);
   * // This would log the name of each file in the filesToProcess array.
   *
   */
  async pipeline(
    files: FileContainer[],
    pipeline: Function[] | undefined,
    opts: WorkspaceOpts
  ) {
    return runPipeline(files, pipeline, opts, this);
  }
}
