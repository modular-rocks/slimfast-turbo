import type { NodePath } from '@babel/traverse';
import type { File } from '@babel/types';

import type { RandomObject } from '../../../../../types';

export const hasBlocklistedIdentifiers =
  (blocklised: string[]) =>
  (path: NodePath, data: RandomObject, opts: RandomObject, ast: File) => {
    let itHasBlocklistedIdentifiers = false;

    path.traverse({
      Identifier(innerPath: RandomObject) {
        if (blocklised.includes(innerPath.node.name)) {
          itHasBlocklistedIdentifiers = true;
        }
      },
    });

    return itHasBlocklistedIdentifiers;
  };
