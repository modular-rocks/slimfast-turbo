import { describe, expect, test } from 'vitest';

import { copy } from './index.js';

describe('"copy" utility', () => {
  test('Should copy properties to an empty object', async () => {
    const localObject = {};
    const foreignObject = { text: 'hello world' };

    copy(localObject, foreignObject);

    expect(localObject).toEqual({ text: 'hello world' });
  });

  test('Should merge properties into an existing object', async () => {
    const localObject = { text: 'hello world' };
    const foreignObject = { sample: 'text' };

    copy(localObject, foreignObject);

    expect(localObject).toEqual({ text: 'hello world', sample: 'text' });
  });

  test('Should remain unchanged when adding an empty object', async () => {
    const localObject = { sample: 'text' };
    const foreignObject = {};

    copy(localObject, foreignObject);

    expect(localObject).toEqual({ sample: 'text' });
  });
});
