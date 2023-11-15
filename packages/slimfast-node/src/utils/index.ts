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
