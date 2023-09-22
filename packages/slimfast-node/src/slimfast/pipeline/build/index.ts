import { NodePath } from '@babel/traverse';

import type { FileContainer } from '@modular-rocks/workspace-node';
import type { SlimFast } from '@modular-rocks/slimfast';

import type {
  RandomObject,
  SlimFastOpts,
  ProvisionalFile,
} from '../../../types';

type Extract = [NodePath, RandomObject];

export const build =
  (builder: Function) =>
  (
    file: FileContainer,
    options: SlimFastOpts,
    state: RandomObject,
    workspace: SlimFast
  ) => {
    const extracted: Extract[] = file.store.extractions;
    if (!extracted.length) return file;

    workspace.refactored.makeDirectory(file); // make sure that its not already in an index

    extracted.forEach((extract: Extract) => {
      const [path, data] = extract;
      const newFile: ProvisionalFile = builder(
        path,
        data,
        file.pathname,
        options
      );
      file.addImport(newFile.import);
      workspace.refactored.addFile(file.spawn(newFile));
    });
    file.updateCode();
    return false;
  };
