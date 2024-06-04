/**
 * Removes duplicate elements from an array, modifying the original array.
 *
 * This function iterates through the provided array and removes any duplicate
 * elements it finds. The original array is modified in place. If the input is not an array,
 * a TypeError is thrown.
 *
 * @param arr - The array to remove duplicates from.
 * @returns The original array with duplicates removed.
 *
 * @example
 * let numbers = [1, 2, 2, 3, 4, 4, 5];
 * unique(numbers);
 * console.log(numbers); // Output: [1, 2, 3, 4, 5]
 */
export function unique<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }

  const len = arr.length;

  for (let i = 0; i < len; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j -= 1;
      }
    }
  }
  return arr;
}

/**
 * Creates a new array with duplicates removed from the provided array.
 *
 * This function creates a copy of the provided array and then applies the {@link unique} function
 * to remove duplicates. The original array remains unmodified. If the input is not an array,
 * a TypeError is thrown.
 *
 * @param arr - The array to remove duplicates from.
 * @returns A new array with duplicates removed.
 *
 * @example
 * let numbers = [1, 2, 2, 3, 4, 4, 5];
 * let uniqueNumbers = uniqueImmutable(numbers);
 * console.log(uniqueNumbers); // Output: [1, 2, 3, 4, 5]
 * console.log(numbers); // Original array remains unchanged: [1, 2, 2, 3, 4, 4, 5]
 */
export function uniqueImmutable<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }

  const newArr = new Array(arr.length);

  for (let i = 0; i < arr.length; i += 1) {
    newArr[i] = arr[i];
  }

  return unique(newArr);
}

export { combineImports } from '../slimfast/pipeline/build/builder/combine-imports';
export { generateImportDeclaration } from '../slimfast/pipeline/build/builder/import-statement';
export { generateJSXElement } from '../slimfast/pipeline/build/builder/replace/jsx-function';
export { generateFunction } from '../slimfast/pipeline/build/builder/replace/normal-function';
export { replace } from '../slimfast/pipeline/build/builder/replace';
export { hasAwait } from '../slimfast/pipeline/build/builder/wrap/has-await';
export { generateExportedJSXComponent } from '../slimfast/pipeline/build/builder/wrap/jsx-function';
export { generateExportedFunction } from '../slimfast/pipeline/build/builder/wrap/normal-function';
export { wrap } from '../slimfast/pipeline/build/builder/wrap';
// double check
export { builder } from '../slimfast/pipeline/build/builder';
// double check
export { build } from '../slimfast/pipeline/build';
// double check
export { extract } from '../slimfast/pipeline/extract';

export { defaultFunctionNameGenerator } from '../slimfast/pipeline/name/default-function-name-generator';
// double check
export { name } from '../slimfast/pipeline/name';

// double check
export { ExpressionVisitor } from '../slimfast/visitors/expression';

// constraints
export { containsIdentifiersInOtherScopes } from '../slimfast/visitors/utils/contraints/contains-identifiers-in-other-scopes';
export { hasAssignmentExpression } from '../slimfast/visitors/utils/contraints/has-assignment-expression';
export { hasBlocklistedIdentifiers } from '../slimfast/visitors/utils/contraints/has-blocklisted-identifiers';
export { hasReturnStatement } from '../slimfast/visitors/utils/contraints/has-return-statement';
export { hasVariableDeclarator } from '../slimfast/visitors/utils/contraints/has-variable-declarator';
export { identifiersNotWithinRange } from '../slimfast/visitors/utils/contraints/identifiers-not-within-range';
export { identifiersWithinRange } from '../slimfast/visitors/utils/contraints/identifiers-within-range';
export { isAFunction } from '../slimfast/visitors/utils/contraints/is-a-function';
export { isCallExpression } from '../slimfast/visitors/utils/contraints/is-call-expression';
export { removesTooMuch } from '../slimfast/visitors/utils/contraints/removes-too-much';
export { shouldIgnore } from '../slimfast/visitors/utils/contraints/should-ignore';
export { tooSmall } from '../slimfast/visitors/utils/contraints/too-small';

// others
export { extractIdentifiers } from '../slimfast/visitors/utils/extract-identifiers';
export { notInExtracted } from '../slimfast/visitors/utils/not-in-extracted';
// double check
export { parser } from '../slimfast/visitors/utils/parser';
export { rejectParentsWithTypes } from '../slimfast/visitors/utils/reject-parents-with-types';

// double check
export { Visitor } from '../slimfast/visitors/visitor';
