import { FileContainer as FileContainerBase } from '@modular-rocks/workspace';

import type { File, Statement } from '@babel/types';

import { Codebase } from '..';
import { parse } from './parse';
import { print } from './print';
import { tooSimple } from './too-simple';

export class FileContainer extends FileContainerBase {
  ast?: File;

  constructor(path: string, code: string, codebase: Codebase) {
    super(path, code, codebase);
  }

  tooSimple() {
    return tooSimple({ ast: this.ast });
  }

  codeToAST() {
    return parse(this.code);
  }

  astToCode(ast: any) {
    return print(ast, {}).code;
  }

  addImport(importStatement: Statement) {
    if (!this.ast || !this.ast.program.body) return false;
    this.ast.program.body.unshift(importStatement);
    return false;
  }
}
