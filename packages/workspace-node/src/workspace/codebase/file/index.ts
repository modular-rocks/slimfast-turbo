import { FileContainer as FileContainerBase } from '@modular-rocks/workspace';

import { parse } from './parse';
import { print } from './print';
import { tooSimple } from './too-simple';

import type { Codebase } from '..';
import type { File, Statement } from '@babel/types';

type EndOfLine = '\r\n' | '\n' | '\r';

export class FileContainer extends FileContainerBase {
  // TODO: Fix type on @modular-rocks/workspace
  // ast?: File;

  constructor(path: string, code: string, codebase: Codebase) {
    super(path, code, codebase);
  }

  tooSimple() {
    return tooSimple({ ast: this.ast });
  }

  /**
   * Determines the dominant end-of-line (EOL) sequence in the current code.
   *
   * There are three primary EOL sequences across different operating systems:
   * - \r\n (CRLF) - Mainly used on Windows
   * - \n (LF) - Used on Unix-like systems, including Linux and macOS
   * - \r (CR) - Mainly used on old Mac systems
   *
   * @param {EndOfLine} [defaultEOL='\n'] - The default EOL sequence to use in case of ties or absence of newlines.
   *
   * @returns The dominant EOL sequence. Defaults to \n if there's a tie or no newlines.
   */
  getDominantEOL(defaultEOL: EndOfLine = '\n') {
    const { code } = this;

    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;

    for (let i = 0; i < code.length; i += 1) {
      if (code[i] === '\r') {
        if (code[i + 1] === '\n') {
          crlfCount += 1;
          i += 1; // Skip the next character since we've already counted it.
        } else {
          crCount += 1;
        }
      } else if (code[i] === '\n') {
        lfCount += 1;
      }
    }

    if (crlfCount > lfCount && crlfCount > crCount) return '\r\n';
    if (lfCount > crlfCount && lfCount > crCount) return '\n';
    if (crCount > crlfCount && crCount > lfCount) return '\r';

    // If there's a tie or no newlines, default to \n (or any preference you have)
    return defaultEOL;
  }

  codeToAST() {
    return parse(this.code);
  }

  astToCode(ast: any) {
    return print(ast, { lineTerminator: this.getDominantEOL() }).code;
  }

  addImport(importStatement: Statement) {
    if (!this.ast || !this.ast.program.body) return false;
    this.ast.program.body.unshift(importStatement);
    return true;
  }
}
