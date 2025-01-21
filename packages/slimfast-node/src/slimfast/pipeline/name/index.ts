import type {
  NamerGenerator,
  NamerGeneratorData,
} from './default-function-name-generator/index.js';
import type { NodePath } from '@babel/traverse';
import type { FileContainer } from '@modular-rocks/workspace-node';

type Extract = [NodePath, NamerGeneratorData];

/**
 * Generates a function to process and potentially rename extracted nodes within a file's storage using a specified naming function.
 *
 * When the returned function is executed, it iterates over each extracted node in the file's storage. For each of these nodes, the naming function (`namer`) is applied, potentially modifying or processing the node based on specific naming criteria.
 *
 * @param namer - A function that dictates how each node should be processed or renamed. It receives the node path and associated data as its parameters.
 * @returns A function that, when executed with a file, processes each extracted node in the file using the provided `namer` function.
 * @example
 * const customNamer = (path, data) => {
 *   // Custom naming logic here...
 * };
 * const nameProcessor = name(customNamer);
 * const processed = nameProcessor(file);
 * if (processed) {
 *   // Handle the processed file or node.
 * }
 */
export const name =
  (namer: NamerGenerator) =>
  /**
   * Processes each extracted node in the provided file using the `namer` function.
   *
   * This function iterates over each extracted node found in the file's storage and applies the provided `namer` function to potentially rename or process the node.
   *
   * @param file - The file containing the extracted nodes.
   * @returns The processed file if any nodes were extracted and processed, otherwise `false`.
   */
  async (file: FileContainer) => {
    const extracted: Extract[] = file.store.extractions;
    if (!extracted.length) return file;

    for (const extract of extracted) {
      const [path, data] = extract;
      await namer(path, data);
    }
    return false;
  };
