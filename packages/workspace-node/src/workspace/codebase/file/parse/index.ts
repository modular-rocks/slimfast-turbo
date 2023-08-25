import { parse as babelParser } from '@babel/parser';

import { RandomObject } from '../../../../types';

// TODO: check type
const babelConfig: RandomObject = {
  sourceType: 'module',
  createParenthesizedExpressions: true,
  plugins: ['jsx', ['typescript', { isTSX: true }], 'babel-plugin-recast'],
};

export const parse = (code: string) => babelParser(code, babelConfig);
