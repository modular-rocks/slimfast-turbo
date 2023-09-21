import type { NodePath } from '@babel/traverse';
import type { File } from '@babel/types';

import type { RandomObject } from '../../../../../types';

export default (blocklised: string[]) =>
  (path: NodePath, data: RandomObject, opts: RandomObject, ast: File) => {
    let hasBlocklistedIdentifiers = false;

    path.traverse({
      Identifier(innerPath: RandomObject) {
        if (blocklised.includes(innerPath.node.name)) {
          hasBlocklistedIdentifiers = true;
        }
      },
    });

    return hasBlocklistedIdentifiers;
  };
