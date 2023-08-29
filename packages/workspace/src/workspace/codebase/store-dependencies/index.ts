import type { Codebase } from '..';

/**
 * Retrieves and stores the dependencies of a codebase based on the provided dependency keys.
 *
 * This function extracts dependencies from the codebase's `package` property based on the provided
 * `dependencyKeys` and returns them as an array of strings. If a dependency key exists within the codebase's package, all its corresponding dependencies are added to the list.
 *
 * @param codebase - The instance of the `Codebase` class which contains details about the project codebase.
 * @param dependencyKeys - An array of strings representing the keys under which dependencies are stored in the codebase's package property (e.g., ['dependencies', 'devDependencies']).
 *
 * @returns An array of strings representing the names of the dependencies found in the codebase's package based on the provided dependency keys.
 *
 * @example
 * const codebase = new Codebase(opts);
 * const keys = ['dependencies', 'devDependencies'];
 * const dependencies = storeDependencies(codebase, keys);
 * console.log(dependencies);
 * // Outputs: ['lodash', 'express', ...]
 */
export const storeDependencies = (
  codebase: Codebase,
  dependencyKeys: string[]
) => {
  const dependencies: Map<string, string> = new Map();
  dependencyKeys.forEach((key: string) => {
    if (codebase.package[key]) {
      Object.keys(codebase.package[key]).forEach((name: string) =>
        dependencies.set(name, name)
      );
    }
  });
  return [...dependencies.keys()];
};
