import { NodePath } from '@babel/traverse';
import t from '@babel/types';

import type { SlimFast } from '@modular-rocks/slimfast';
import type { FileContainer } from '@modular-rocks/workspace-node';

import type { Visitor } from '../../visitors/visitor';
import type { RandomObject } from '../../../types';

type Namer = (path: NodePath, data: RandomObject, options: Option) => void;
type Builder = (
  path: NodePath,
  data: RandomObject,
  file: FileContainer
) => ProvisionalFile;

interface Option {
  iterator: Function;
  visitors: Visitor[];
  builder: Builder;
  namer: Namer;
}

interface ProvisionalFile {
  pathname: string;
  ast: Node;
  import: t.Statement;
}

/**
 * Generates a function that extracts relevant nodes from a provided file's Abstract Syntax Tree (AST) based on a set of visitor patterns.
 *
 * @param visitors - An array of visitors which dictate which nodes from the AST should be extracted.
 * @returns A function that processes the file's AST to extract nodes matching the visitor patterns.
 *
 * @example
 * const extractionFunction = extract(myVisitors);
 * const processedFile = extractionFunction(file, extractionOptions, state, workspace);
 *
 * // Alternatively, the function can be used directly:
 * const processedFile = extract(myVisitors)(file, extractionOptions, state, workspace);
 */
export const extract =
  (visitors: Visitor[]) =>
  /**
   * Processes a file's Abstract Syntax Tree (AST) to extract nodes based on the provided visitor patterns.
   *
   * The function first parses the file to retrieve its AST. If the file has a 'simple' flag set,
   * it skips the extraction process. Otherwise, it traverses the AST using the provided visitors
   * and stores matching nodes in the `extracted` map. The extracted nodes are then stored in the
   * file's `store.extractions` property.
   *
   * @param file - The file containing the AST to be processed.
   * @param options - Extraction options that guide the process.
   * @param state - The stateful information that might be used during extraction.
   * @param workspace - The workspace instance associated with the extraction.
   * @returns The processed file or `false` if no nodes were extracted.
   *
   * @example
   * const processedFile = extractionFunction(file, extractionOptions, state, workspace);
   */
  (
    file: FileContainer,
    options: Option,
    state: RandomObject,
    workspace: SlimFast
  ) => {
    file.parse();
    if (file.simple) {
      file.store.extractions = [];
      return file;
    }

    const extracted: Map<NodePath, any> = new Map();

    visitors.forEach((Visitor: any) => {
      // TODO: fix ESLint error
      // eslint-disable-next-line no-new
      new Visitor(file.ast, options, state, extracted);
    });

    file.store.extractions = Array.from(extracted);
    return false;
  };
