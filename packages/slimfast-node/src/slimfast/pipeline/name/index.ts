import t from '@babel/types';
import { NodePath, Node } from '@babel/traverse';

import type { FileContainer } from '@modular-rocks/workspace-node';
import type { SlimFast } from '@modular-rocks/slimfast';

import type { RandomObject, VisitorType } from '../../../types';

interface ProvisionalFile {
  pathname: string;
  ast: Node;
  import: t.Statement;
}

type Extract = [NodePath, Data];

interface Data {
  [property: string]: string;
}

type Namer = (path: NodePath, data: RandomObject, options: Option) => void;
type Builder = (
  path: NodePath,
  data: RandomObject,
  file: FileContainer
) => ProvisionalFile;

interface Option {
  visitors: VisitorType[];
  builder: Builder;
  namer: Namer;
}

export default (namer: Function) =>
  (
    file: FileContainer,
    options: Option,
    state: RandomObject,
    workspace: SlimFast
  ) => {
    const extracted: Extract[] = file.store.extractions;
    if (!extracted.length) return file;

    extracted.forEach((extract: Extract) => {
      const [path, data] = extract;
      namer(path, data, options);
    });
    return false;
  };
