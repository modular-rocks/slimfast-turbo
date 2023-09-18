import type { Statement } from '@babel/types';
import type { Codebase as CodebaseBase } from '@modular-rocks/workspace';
import type { RandomObject } from '@modular-rocks/workspace/dist/types/types';
import type { FileHandler as FileHandlerBase } from '@modular-rocks/workspace/dist/types/workspace/codebase/file';

import { FileContainer as FileContainerBase } from '@modular-rocks/workspace';

import { Codebase } from '..';
import { parse } from './parse';
import { print } from './print';
import { tooSimple } from './too-simple';

type EndOfLine = '\r\n' | '\n' | '\r';

export class FileHandler implements FileHandlerBase {
  private fileContainer!: FileContainerBase;

  private codebase!: CodebaseBase;

  assignFileContainer(fileContainer: FileContainerBase): this {
    this.fileContainer = fileContainer;
    return this;
  }

  assignCodebase(codebase: CodebaseBase): this {
    this.codebase = codebase;
    return this;
  }

  tooSimple() {
    return tooSimple({ ast: this.fileContainer.ast });
  }

  addImport(importStatement: Statement) {
    if (!this.fileContainer.ast || !this.fileContainer.ast.program.body) {
      return false;
    }
    this.fileContainer.ast.program.body.unshift(importStatement);
    return true;
  }

  codeToAST(): RandomObject {
    return parse(this.fileContainer.code);
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
    const { code } = this.fileContainer;

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

  astToCode(ast: any) {
    return print(ast, {
      lineTerminator: this.getDominantEOL(),
    }).code;
  }
}

export class FileContainer extends FileContainerBase<FileHandler> {
  ast?: File;

  constructor(path: string, code: string, codebase: Codebase) {
    super(new FileHandler(), path, code, codebase);
  }
}
