import t from '@babel/types';
import { NodePath, Node } from '@babel/traverse';

import type { FileContainer } from '@modular-rocks/workspace-node';
import type { SlimFast } from '@modular-rocks/slimfast';

import type { RandomObject, VisitorType } from '../../../types';

interface ProvisionalFile {
  pathname: string;
  ast: Node;
  import: t.Statement;
}

type Extract = [NodePath, Data];

interface Data {
  [property: string]: string;
}

type Namer = (path: NodePath, data: RandomObject, options: Option) => void;
type Builder = (
  path: NodePath,
  data: RandomObject,
  file: FileContainer
) => ProvisionalFile;

interface Option {
  visitors: VisitorType[];
  builder: Builder;
  namer: Namer;
}

/**
 * Generates a function to process and potentially rename extracted nodes within a file's storage using a specified naming function.
 *
 * When the returned function is executed, it iterates over each extracted node in the file's storage. For each of these nodes, the naming function (`namer`) is applied, potentially modifying or processing the node based on specific naming criteria.
 *
 * @param namer - A function that dictates how each node should be processed or renamed. It receives the node path, associated data, and options as its parameters.
 * @returns A function that, when executed with a file, options, state, and workspace, processes each extracted node in the file using the provided `namer` function.
 * @example
 * const customNamer = (path, data, options) => {
 *   // Custom naming logic here...
 * };
 * const nameProcessor = name(customNamer);
 * const processed = nameProcessor(file, options, state, workspace);
 * if (processed) {
 *   // Handle the processed file or node.
 * }
 */
export const name =
  (namer: Function) =>
  /**
   * Processes each extracted node in the provided file using the `namer` function.
   *
   * This function iterates over each extracted node found in the file's storage and applies the provided `namer` function to potentially rename or process the node.
   *
   * @param file - The file containing the extracted nodes.
   * @param options - Configuration options for processing.
   * @param state - Stateful information for processing.
   * @param workspace - Workspace data relevant to the naming process.
   * @returns The processed file if any nodes were extracted and processed, otherwise `false`.
   */
  (
    file: FileContainer,
    options: Option,
    state: RandomObject,
    workspace: SlimFast
  ) => {
    const extracted: Extract[] = file.store.extractions;
    if (!extracted.length) return file;

    extracted.forEach((extract: Extract) => {
      const [path, data] = extract;
      namer(path, data, options);
    });
    return false;
  };
