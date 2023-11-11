import type { BuilderData, BuilderOpts } from './builder';
import type { ProvisionalFile } from '../../../types';
import type { NodePath } from '@babel/traverse';
import type { SlimFast } from '@modular-rocks/slimfast';
import type { FileContainer } from '@modular-rocks/workspace-node';

type Extract = [NodePath, BuilderData];

type Builder = (
  path: NodePath,
  data: BuilderData,
  filepath: string,
  options: BuilderOpts
) => ProvisionalFile;

/**
 * Generates a function that processes and builds files based on extracted nodes from a given file's Abstract Syntax Tree (AST).
 *
 * @param builder - A function that produces a provisional file structure based on AST nodes.
 * @returns A function that processes the file and incorporates new file structures into the workspace.
 *
 * @example
 * const buildFunction = build(myBuilder);
 * const updatedFile = buildFunction(file, buildOptions, state, workspace);
 *
 * // Alternatively, the function can be used directly:
 * const updatedFile = build(myBuilder)(file, buildOptions, state, workspace);
 */
export const build =
  (builder: Builder) =>
  /**
   * Processes a file to generate new file structures based on extracted nodes and incorporates these into the workspace.
   *
   * For each node extracted from the file's AST, the function generates provisional file structures and ensures that the original file imports any newly created files. The new files are then added to the workspace.
   *
   * @param file - The original file containing the extracted nodes.
   * @param options - Build options that guide the process.
   * @param state - Stateful information that might be used during the building process.
   * @param workspace - The workspace instance associated with the build.
   * @returns The updated file or `false` if no nodes were extracted.
   *
   * @example
   * const updatedFile = buildFunction(file, buildOptions, state, workspace);
   */
  (
    file: FileContainer,
    options: BuilderOpts,
    // TODO: Remove this
    state: any,
    workspace: SlimFast
  ) => {
    // TODO: Double check this type
    const extracted: Extract[] = file.store.extractions;
    if (!extracted.length) return file;

    workspace.refactored.makeDirectory(file); // make sure that its not already in an index

    extracted.forEach((extract) => {
      const [path, data] = extract;
      const newFile = builder(path, data, file.pathname, options);
      file.addImport(newFile.import);
      workspace.refactored.addFile(file.spawn(newFile));
    });
    file.updateCode();
    return false;
  };
