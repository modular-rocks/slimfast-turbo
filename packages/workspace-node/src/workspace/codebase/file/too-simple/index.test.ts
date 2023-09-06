import { describe, expect, test } from 'vitest';
import { measure, tooSimple } from '.';

describe('"measure" utility function', () => {
  test('should return loc metric when loc option is set', () => {
    const opts = {
      loc: true,
      metricOpts: {
        code: 'console.log("hello world");',
      },
    };
    const scores = measure(opts);

    expect(scores.loc).toBe(1);
  });

  test('should return complexity metric when complexity option is set', () => {
    const opts = {
      complexity: true,
      metricOpts: {
        code: 'console.log("hello world");',
      },
    };
    const scores = measure(opts);

    expect(scores.complexity).toBe(0);
  });

  test('should return maintainability metric when maintainability option is set', () => {
    const opts = {
      maintainability: true,
      metricOpts: {
        code: 'console.log("hello world");',
      },
    };
    const scores = measure(opts);

    expect(scores.maintainability).toBe(100);
  });

  test('should return all metrics when all options are set', () => {
    const opts = {
      loc: true,
      complexity: true,
      maintainability: true,
      metricOpts: {
        code: 'console.log("hello world");',
      },
    };
    const scores = measure(opts);

    expect(scores.loc).toBe(1);
    expect(scores.complexity).toBe(0);
    expect(scores.maintainability).toBe(100);
  });
});

describe('"tooSimple" utility function', () => {
  test('should return true when lines of code (loc) is below minLoc', () => {
    const metricOptions = {
      code: 'console.log("hello world");', // assuming this has a loc of 1
      minLoc: 5,
    };
    const result = tooSimple(metricOptions);
    expect(result).toBe(true);
  });

  test('should return true when maintainability is above minMaintainability', () => {
    const metricOptions = {
      code: 'console.log("hello world");', // assuming this has a maintainability of 100
      minMaintainability: 95,
    };
    const result = tooSimple(metricOptions);
    expect(result).toBe(true);
  });

  test('should return false when both loc and maintainability are within acceptable limits', () => {
    const metricOptions = {
      code: 'console.log("hello world");',
      minLoc: 1,
      minMaintainability: 999,
    };
    const result = tooSimple(metricOptions);
    expect(result).toBe(false);
  });
});
