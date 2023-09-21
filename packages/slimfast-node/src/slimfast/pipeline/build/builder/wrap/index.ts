import { NodePath } from '@babel/traverse';

import generateJsxFunction from './jsx-function';
import generateNormalFunction from './normal-function';

import type { RandomObject, SlimFastOpts } from '../../../../../types';

export default (path: NodePath, data: RandomObject, options: SlimFastOpts) => {
  return path.isJSXElement()
    ? (options.jsxGenerator || generateJsxFunction)(path, data)
    : (options.functionGenerator || generateNormalFunction)(path, data);
};
