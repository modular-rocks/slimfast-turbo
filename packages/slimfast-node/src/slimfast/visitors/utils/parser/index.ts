import parser from '@babel/parser';

import type { RandomObject } from '../../../../types';

const babelConfig: RandomObject = {
  sourceType: 'module',
  createParenthesizedExpressions: true,
  plugins: ['jsx', ['typescript', { isTSX: true }], 'babel-plugin-recast'],
};

export default (code: string) => parser.parse(code, babelConfig);
