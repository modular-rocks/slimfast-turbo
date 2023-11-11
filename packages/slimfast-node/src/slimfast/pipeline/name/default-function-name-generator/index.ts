import type { NodePath } from '@babel/traverse';

/**
 * Checks if a given AST node path contains any JSX elements.
 *
 * @param path - The AST node path to be checked for JSX elements.
 * @returns `true` if the node path contains JSX elements, otherwise `false`.
 *
 * @example
 * const hasJSXContent = testJSX(nodePath);
 * if (hasJSXContent) {
 *   // Handle the JSX content or component.
 * }
 */
const testJSX = (path: NodePath) => {
  let hasJSX = false;

  path.traverse({
    JSXElement() {
      hasJSX = true;
    },
  });

  return hasJSX;
};

export type NamerGenerator = (
  path: NodePath,
  data: NamerGeneratorData
) => NamerGeneratorData;

export type NamerGeneratorData = {
  name: string;
  folder: string;
};

/**
 * Generates a default naming function for JavaScript functions or JSX components based on their content and an initial number.
 *
 * @param num - The initial number to start naming from.
 * @returns A {@link NamerGenerator} function that, when executed with a node path and data, generates and assigns names and folders based on the content of the path.
 *
 * @example
 * const generateName = defaultFunctionNameGenerator(5);
 * const namingResult = generateName(nodePath, data);
 * console.log(namingResult.name);
 * // Outputs: "function6" or "component6" based on content of nodePath
 *
 * // Alternatively, the function can be used directly:
 * const namingResult = defaultFunctionNameGenerator(num)(path, data);
 */
export const defaultFunctionNameGenerator: (num: number) => NamerGenerator = (
  num
) => {
  let lastNumber = num;

  /**
   * Generates and assigns a name and a folder based on the content of the provided path.
   * Names are constructed using a noun ("function" or "component") and a consecutively incrementing number.
   * Folders are determined ("functions" or "components") based on whether the path contains JSX content.
   *
   * @param path - NodePath to determine naming and folder assignment.
   * @param data - {@link NamerGeneratorData} object wherein the determined name and folder will be stored.
   * @returns An object containing the generated name and folder.
   */
  return (path, data) => {
    lastNumber += 1;
    const containsJSX = testJSX(path);
    const noun = containsJSX ? 'component' : 'function';
    const folder = containsJSX ? 'components' : 'functions';
    const name = `${noun}${lastNumber}`;
    data.name = name;
    data.folder = folder;
    return {
      name,
      folder,
    };
  };
};
