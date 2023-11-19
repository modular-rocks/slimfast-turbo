import { describe, expect, test } from 'vitest';

import { unique, uniqueImmutable } from '.';

describe('"array-utils" tests', () => {
  describe('unique function', () => {
    test('removes duplicate elements from an array', () => {
      const numbers = [1, 2, 2, 3, 4, 4, 5];
      unique(numbers);
      expect(numbers).toEqual([1, 2, 3, 4, 5]);
    });

    test('does not modify an array without duplicates', () => {
      const numbers = [1, 2, 3, 4, 5];
      unique(numbers);
      expect(numbers).toEqual([1, 2, 3, 4, 5]);
    });

    test('handles an empty array correctly', () => {
      const emptyArray: any[] = [];
      unique(emptyArray);
      expect(emptyArray).toEqual([]);
    });

    test('throws a TypeError for non-array inputs', () => {
      expect(() => unique('not an array' as unknown as any[])).toThrow(
        TypeError
      );
    });
  });

  describe('uniqueImmutable function', () => {
    test('creates a new array with duplicates removed', () => {
      const numbers = [1, 2, 2, 3, 4, 4, 5];
      const uniqueNumbers = uniqueImmutable(numbers);
      expect(uniqueNumbers).toEqual([1, 2, 3, 4, 5]);
      expect(numbers).toEqual([1, 2, 2, 3, 4, 4, 5]); // Original array remains unchanged
    });

    test('returns a new array identical to the original if no duplicates', () => {
      const numbers = [1, 2, 3, 4, 5];
      const uniqueNumbers = uniqueImmutable(numbers);
      expect(uniqueNumbers).toEqual([1, 2, 3, 4, 5]);
    });

    test('handles an empty array correctly', () => {
      const emptyArray: any[] = [];
      const result = uniqueImmutable(emptyArray);
      expect(result).toEqual([]);
    });

    test('throws a TypeError for non-array inputs', () => {
      expect(() => uniqueImmutable('not an array' as unknown as any[])).toThrow(
        TypeError
      );
    });
  });
});
