import { parse } from '@babel/parser';

import type { RandomObject } from '@modular-rocks/traverse-files/dist/types/types';

const babelConfig: RandomObject = {
  sourceType: 'module',
  createParenthesizedExpressions: true,
  plugins: ['jsx', ['typescript', { isTSX: true }], 'babel-plugin-recast'],
};

export default (code: string) => parse(code, babelConfig);
