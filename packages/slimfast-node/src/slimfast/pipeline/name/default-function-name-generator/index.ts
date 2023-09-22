import { NodePath } from '@babel/traverse';

import type { RandomObject } from '../../../../types';

const testJSX = (path: NodePath) => {
  let hasJSX = false;

  path.traverse({
    JSXElement() {
      hasJSX = true;
    },
  });

  return hasJSX;
};

export const defaultFunctionNameGenerator = (num: number) => {
  let lastNumber = num;
  return (path: NodePath, data: RandomObject) => {
    lastNumber += 1;
    const containsJSX = testJSX(path);
    const noun = containsJSX ? 'component' : 'function';
    const folder = containsJSX ? 'components' : 'functions';
    const name = `${noun}${lastNumber}`;
    data.name = name;
    data.folder = folder;
    return {
      name,
      folder,
    };
  };
};
