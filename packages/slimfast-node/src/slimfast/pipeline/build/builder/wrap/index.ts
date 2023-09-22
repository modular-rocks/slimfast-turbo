import { NodePath } from '@babel/traverse';

import { generateExportedJSXComponent } from './jsx-function';
import { generateExportedFunction } from './normal-function';

import type { RandomObject, SlimFastOpts } from '../../../../../types';

export const wrap = (
  path: NodePath,
  data: RandomObject,
  options: SlimFastOpts
) => {
  return path.isJSXElement()
    ? (options.jsxGenerator || generateExportedJSXComponent)(path, data)
    : (options.functionGenerator || generateExportedFunction)(path, data);
};
