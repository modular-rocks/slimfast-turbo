import { CodebaseOpts } from '@modular-rocks/workspace-node/dist/types/types';
import type { Statement } from '@babel/types';

export type RandomObject = Record<string, any>;

export type SlimFastOpts = CodebaseOpts & {
  visitors?: any[];
  namer?: Function;
  builder?: Function;
  jsxReplacer?: Function;
  functionReplacer?: Function;
  jsxGenerator?: Function;
  functionGenerator?: Function;
  wrap?: Function;
  replace?: Function;
};

export type VisitorType = {
  ast: any;
  extracted: Map<any, any>;
  state: RandomObject;
  opts: SlimFastOpts;
};

export type ProvisionalFile = {
  pathname: string;
  ast: RandomObject;
  import: Statement;
};
