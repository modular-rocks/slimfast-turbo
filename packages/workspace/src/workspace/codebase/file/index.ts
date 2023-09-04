import { dirname } from 'path';

import type { Codebase } from '..';
import type { FileStore } from '../../../types';

export type ProvisionalFile = {
  pathname: string;
  ast: any;
  import: any;
};

export class FileContainer {
  /**
   * The relative path of the file within the codebase, excluding the root directory.
   *
   * @example
   * // For a codebase with a root of `/home/projects` and a file at `/home/projects/project/file1.js`:
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * console.log(file.pathname); // Outputs: '/project/file1.js'
   */
  pathname: string;

  /**
   * The absolute path of the file within the file system.
   *
   * @example
   * // For a codebase with a root of `/home/projects` and a file at `/home/projects/project/file1.js`:
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * console.log(file.fullPath); // Outputs: '/home/projects/project/file1.js'
   */
  fullPath: string;

  // TODO: add example
  /**
   * Can be used to store the semantic type of module for your system; if you're defining modules semantically differently to one another, then you can group files by semantic type and store the module type here.
   */
  type?: string;

  /**
   * The content of the file represented as a string. It holds the actual code or data within the file.
   *
   * @example
   * // For a file with the content "console.log('Hello, World!');":
   * const file = new FileContainer('/home/projects/project/path1', 'console.log("hello world");', codebase);
   * console.log(file.code); // Outputs: 'console.log("Hello World");'
   */
  code: string;

  /**
   * Stores information about the simplicity of the AST in the file. Using another function, the quality of the AST can be measured using metrics and determined to be a simple piece of code or a complex piece of code.
   *
   * @example
   * const file = new FileContainer('/home/projects/project/path1', '', codebase);
   * console.log(file.simple);
   * // Outputs: true of false
   */
  simple: Boolean;

  /**
   * Indicates whether the file has a parent directory other than the root or current directory.
   * If the parent directory is either root or current, the property is `false`. Otherwise, it's `true`.
   *
   * @example
   * // For a codebase with a root of `/home/projects` and a file at `/home/projects/project/file1.js`:
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * console.log(file.hasParent); // Outputs: true
   * // For a codebase with a root of `/home/projects` and a file at `/home/projects/file1.js`:
   * const file = new FileContainer('/home/projects/file1.js', 'console.log("hello world")', codebase);
   * console.log(file.hasParent); // Outputs: false
   */
  hasParent: Boolean;

  /**
   * Represents the codebase to which this file belongs. The codebase contains metadata
   * and utilities that might be used for file manipulations, parsing, saving, and other
   * operations related to the file.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * console.log(file.codebase); // Outputs: Instance of Codebase
   */
  codebase: Codebase;

  // TODO: add example
  /**
   * General store for storing any type of data associated to the file. Mostly used during the pipeline enumeration where you may wish to store data scoped to the specific file that is retrievable later.
   */
  store: FileStore;

  /**
   * Represents the Abstract Syntax Tree (AST) of the file's content. The AST provides a structured
   * representation of the source code, making it easier to analyze, manipulate, and generate code.
   * This property is populated after parsing the file's content.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * file.parse();
   * console.log(file.ast); // Outputs: AST representation of 'console.log("hello world")'
   */
  ast?: any;

  /**
   * @param path - The absolute path of the file within the file system.
   * @param code - The content of the file represented as a string.
   * @param codebase - The codebase to which this file belongs.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   */
  constructor(path: string, code: string, codebase: Codebase) {
    this.codebase = codebase;
    this.pathname = codebase.replaceRoot(path);
    this.fullPath = path;
    this.code = code;
    this.simple = false;
    this.store = {};

    const parentPath = dirname(this.pathname);
    this.hasParent = !['/', '.'].includes(parentPath);
  }

  /**
   * Determines if the content of the file is too simple based on specific criteria.
   * In the current implementation, this method always returns `false`.
   *
   * @returns Returns `true` if the file's content is considered too simple; otherwise, returns `false`.
   *
   * @example
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * console.log(file.tooSimple()); // Outputs: false
   */
  tooSimple(): Boolean {
    return false;
  }

  /**
   * Converts the file's content (source code) into its Abstract Syntax Tree (AST) representation.
   *
   * This method acts as a placeholder and should be implemented to parse the file's content
   * into a meaningful AST based on the language or structure of the file.
   *
   * @returns The AST representation of the file's content. In the current implementation, it returns an empty object.
   *
   * @example
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * const ast = file.codeToAST();
   * console.log(ast); // Outputs: {}
   */
  codeToAST() {
    return {};
  }

  /**
   * Converts the provided Abstract Syntax Tree (AST) back into its string representation (source code).
   *
   * This method acts as a placeholder and should be implemented to generate source code
   * from a given AST based on the language or structure of the file.
   *
   * @param ast - The AST representation of the file's content to be converted back to source code.
   * If not provided, it should assume the file's current AST.
   * @returns The string representation (source code) of the provided AST.
   * In the current implementation, it always returns an empty string.
   *
   * @example
   * const file = new FileContainer('/home/projects/project/file1.js', 'console.log("hello world")', codebase);
   * const code = file.astToCode();
   * console.log(code); // Outputs: ''
   */
  astToCode(ast?: any) {
    return '';
  }

  /**
   * Parses the file's content into its Abstract Syntax Tree (AST) representation
   * and determines if the content is too simple.
   *
   * If the AST already exists and the content is marked as simple,
   * the method will exit early without reparsing.
   * Otherwise, it will parse the content into an AST and check for its simplicity.
   *
   * @example
   * const file = new FileContainer('/path/to/file.js', 'const a = 1;', codebase);
   * file.parse();
   * console.log(file.ast); // Outputs: AST representation of 'const a = 1;'
   */
  parse() {
    if (this.ast && this.simple) return;
    this.ast = this.codeToAST();
    this.simple = this.tooSimple();
  }

  /**
   * Converts the file's Abstract Syntax Tree (AST) back into its string representation.
   *
   * If an AST is provided as an argument, it will use that AST for the conversion.
   * If no AST is provided and the current file instance doesn't have an existing AST,
   * it will first parse the file's content to generate the AST and then convert it
   * into its string representation.
   *
   * @param ast - An optional AST to be converted. If not provided, the method uses the file's current AST.
   * @returns The string representation of the AST, which is the source code.
   *
   * @example
   * const file = new FileContainer('/path/to/file.js', 'const a = 1;', codebase);
   * const codeString = file.print();
   * console.log(codeString);
   * // Expected output (based on current implementation): ''
   */
  print(ast?: any) {
    if (ast) {
      return this.astToCode(ast);
    }
    if (!this.ast) this.parse();
    return this.astToCode(this.ast);
  }

  /**
   * Creates and returns a new instance of the `FileContainer` class using the provided `file` data.
   *
   * The new instance is created using the `pathname` from the provided `file`,
   * the string representation of its AST (using the current `FileContainer`'s `print` method),
   * and the current `FileContainer`'s `codebase`.
   *
   *
   * @returns Returns a new instance of the `FileContainer` class.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const provisionalFile = { pathname: '/path/to/new/file.js', ast: {}, codebase };
   * const newFile = existingFileContainer.spawn(provisionalFile);
   * console.log(newFile.pathname); // Outputs: '/path/to/new/file.js'
   */
  spawn(file: ProvisionalFile) {
    return new FileContainer(
      file.pathname,
      this.print(file.ast),
      this.codebase
    );
  }

  /**
   * Should add an import statement to the file
   *
   * This method is currently a placeholder and always returns `false`, indicating that the import was not added.
   * In a more complete implementation, it might modify the file's content to include the provided import statement.
   *
   * @param importStatement - The import statement or data to be added to the file.
   * @returns Returns `true` if the import was successfully added; otherwise, returns `false`.
   *
   * @example
   * const file = new FileContainer('/path/to/file.js', 'console.log("Hello");', codebase);
   * const result = file.addImport('import { hello } from "./hello";');
   * console.log(result); // Outputs: false
   */
  addImport(importStatement?: any) {
    return false;
  }

  /**
   * Updates the `code` property of the FileContainer instance with the string representation of its AST.
   *
   * This method first converts the current AST (Abstract Syntax Tree) of the file to its source code representation
   * using the `print` method. It then updates the `code` property of the FileContainer instance with this representation.
   *
   * @example
   * const file = new FileContainer('/path/to/file.js', 'console.log("Hello");', codebase);
   * file.updateCode();
   * console.log(file.code);
   * // Depending on the implementation of `print`, this might output: 'console.log("Hello");'
   */
  updateCode() {
    this.code = this.print();
  }

  /**
   * Saves the current content of the `File` instance to the file system using its associated `Codebase` instance.
   * The file is saved at the location specified by the `pathname` property of the `File` instance,
   * and its content will be the value of the `code` property of this `File` instance.
   *
   * @example
   * const file = new File(codebase, '/path/to/script.js', 'console.log("Hello World");');
   * await file.save();
   * // The file is saved at '/path/to/script.js' with the content 'console.log("Hello World");'
   */
  save() {
    return this.codebase.saveFile(this.pathname, this.code);
  }
}
