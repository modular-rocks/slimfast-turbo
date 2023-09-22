import { NodePath } from '@babel/traverse';

import { generateJSXElement } from './jsx-function';
import { generateFunction as generateCalleeFunction } from './normal-function';

import type { RandomObject, SlimFastOpts } from '../../../../../types';

export const replace = (
  name: string,
  path: NodePath,
  data: RandomObject,
  options: SlimFastOpts
) => {
  const calleeFunction = path.isJSXElement()
    ? (options.jsxReplacer || generateJSXElement)(name, data)
    : (options.functionReplacer || generateCalleeFunction)(name, data);
  path.replaceWith(calleeFunction);
  return calleeFunction;
};
