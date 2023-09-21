import { NodePath } from '@babel/traverse';
import t from '@babel/types';

import type { SlimFast } from '@modular-rocks/slimfast';
import type { FileContainer } from '@modular-rocks/workspace-node';

import type Visitor from '../../visitors/visitor';
import type { RandomObject } from '../../../types';

type Namer = (path: NodePath, data: RandomObject, options: Option) => void;
type Builder = (
  path: NodePath,
  data: RandomObject,
  file: FileContainer
) => ProvisionalFile;

interface Option {
  iterator: Function;
  visitors: Visitor[];
  builder: Builder;
  namer: Namer;
}

interface ProvisionalFile {
  pathname: string;
  ast: Node;
  import: t.Statement;
}

export default (visitors: Visitor[]) =>
  (
    file: FileContainer,
    options: Option,
    state: RandomObject,
    workspace: SlimFast
  ) => {
    file.parse();
    if (file.simple) {
      file.store.extractions = [];
      return file;
    }

    const extracted: Map<NodePath, any> = new Map();

    visitors.forEach((Visitor: any) => {
      // TODO: fix ESLint error
      // eslint-disable-next-line no-new
      new Visitor(file.ast, options, state, extracted);
    });

    file.store.extractions = Array.from(extracted);
    return false;
  };
