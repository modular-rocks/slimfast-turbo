import { basename, dirname } from 'path';

import { copy } from './copy';
import { FileContainer } from './file';
import { makeDirectory } from './make-directory';
import { fromFile, saveFile, saveToJSON } from './save';
import { storeDependencies } from './store-dependencies';

import type { FileContainer as FileContainerType } from './file';
import type {
  CodebaseOpts,
  FilesContainer,
  PackageContents,
  RandomObject,
} from '../../types';

export class Codebase {
  /**
   * Represents the root directory of the codebase, providing the absolute path to where the files are located.
   *
   * The `src` property holds the absolute path to the root directory of the codebase. It serves as a reference
   * point for various operations within the `Codebase` class, such as storing, retrieving, and manipulating files.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   src: '/home/projects/project/'
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.src);
   * // Outputs: '/home/projects/project/'
   */
  src: string;

  /**
   * An array of file extensions that the codebase considers for processing.
   *
   * The `extensions` property contains a list of file extensions that determine which files in the
   * codebase are relevant for various operations, such as parsing or transformation. Files with extensions
   * not listed in this array may be ignored or excluded from certain processes.
   *
   * Extensions in this array should include the leading dot (e.g., `.js`, `.ts`).
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   extensions: ['.js', '.ts']
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.extensions);
   * // Outputs: ['.js', '.ts']
   */
  extensions: string[];

  /**
   * An array of file paths or patterns that the codebase should ignore during processing.
   *
   * The `ignoredFiles` property specifies files or file patterns that should be excluded from
   * certain operations within the codebase, such as parsing, transformation, or dependency analysis.
   * This can be useful for avoiding files that are not relevant to the project's source code, such as
   * configuration files, test files, or documentation.
   *
   * Paths or patterns in this array can be absolute paths, relative paths, or even glob patterns.
   *
   * Some `\` are scaped because of JSDoc limitations
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   ignoredFiles: ['/path/to/config.js', '/path/to/config2.js']
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.ignoredFiles);
   * // Outputs: ['/path/to/config.js']
   *
   */
  ignoredFiles: string[];

  /**
   * An array of import statements or patterns that the codebase should ignore during processing.
   *
   * The `ignoredImports` property specifies import statements or patterns that should be excluded or ignored
   * during certain operations within the codebase, such as dependency analysis or transformation. This can
   * be useful to avoid processing external libraries, mock data, or any other imports that are not essential
   * for the project's main logic.
   *
   * The values in this array can be specific import names, modules, or even patterns that match multiple imports.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   ignoredImports: ['mockData', 'externalLibrary']
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.ignoredImports);
   * // Outputs: ['mockData', 'externalLibrary']
   */
  ignoredImports: string[];

  /**
   * A collection of file instances managed by the codebase, indexed by their relative pathnames.
   *
   * The `files` property is an object where each key represents the relative pathname of a file
   * within the codebase, and each value is an instance of `FileContainer` that encapsulates the file's
   * details, contents, and operations.
   *
   * This structured representation allows for easy access, manipulation, and management of individual
   * files within the codebase.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   src: '/home/projects/project/',
   *   files: [
   *     ['/home/projects/project/path1.js', 'console.log("hello world")'],
   *   ],
   * };
   * const codebase = new Codebase(opts);
   * const fileInstance = codebase.files['/project/path1.js'];
   * console.log(fileInstance);
   * // Outputs: Instance of FileContainer for 'path1.js'
   */
  files: FilesContainer;

  /**
   * The name of the root directory of the codebase.
   *
   * The `rootName` property provides the name of the root directory where the files of the codebase reside.
   * It is extracted from the `src` property by taking the base name of the provided directory path.
   *
   * This property can be useful for referencing the root directory's name without the need for full path information,
   * especially when working with operations that require relative pathnames or when displaying directory structures.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   src: '/home/projects/project/'
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.rootName);
   * // Outputs: 'project'
   */
  rootName: string;

  /**
   * Provides the absolute path to the directory containing the root of the codebase, excluding the root directory itself.
   *
   * The `srcWithoutRoot` property provides the absolute path to the directory that contains the root of the codebase.
   * It is derived by removing the base name (root name) of the `src` property. This can be useful when operations
   * require references to directories just above the root or when setting up paths relative to the main project directory.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   src: '/home/projects/project/'
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.srcWithoutRoot);
   * // Outputs: '/home/projects'
   */
  srcWithoutRoot: string;

  /**
   * Represents the contents of the package configuration for the codebase.
   *
   * The `package` property provides a structured representation of the package or configuration data associated
   * with the codebase. This can include details like package name, version, dependencies, scripts, and more.
   * It is typically derived from a package configuration file, such as a `package.json` in a Node.js project.
   *
   * As this property can store a variety of information specific to the project's setup and requirements,
   * it is defined using the `PackageContents` type, which allows for flexible key-value pairs.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   packageContents: {
   *     name: 'my-project',
   *     version: '1.0.0',
   *     dependencies: {
   *       'some-library': '^1.2.3'
   *     }
   *   }
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.package.name);
   * // Outputs: 'my-project'
   */
  package: PackageContents;

  /**
   * A list of dependencies associated with the codebase.
   *
   * The `dependencies` property contains an array of strings representing the dependencies of the codebase.
   * These dependencies could be libraries, frameworks, or other modules that the codebase relies on for
   * its functionality. The list can be populated based on the analysis of import or require statements
   * in the codebase files or derived from other configuration data.
   *
   * This property is especially useful for understanding the external components the codebase interacts with,
   * aiding in tasks such as dependency management, bundling, or tree-shaking.
   *
   * @example
   * const codebase = new Codebase(opts);
   * codebase.storeDependencies(); // Assuming this method populates the `dependencies` property
   * console.log(codebase.dependencies);
   * // Outputs: ['lodash', 'express', 'react']
   */
  dependencies: string[];

  /**
   * Configuration options used to initialize and manage the codebase.
   *
   * The `opts` property contains various settings and parameters that influence the behavior, structure,
   * and capabilities of the `Codebase` instance. These settings include:
   *
   * - `pipeline`: An optional array of functions representing a sequence of transformations or operations.
   * - `src`: The source directory for the codebase.
   * - `extensions`: An array of file extensions considered by the codebase.
   * - `ignoredFiles`: An array of file paths or patterns that the codebase should ignore.
   * - `packageContents`: An optional object representing the contents of the project's package (e.g., package.json).
   * - `packagePath`: An optional path to the project's package file.
   * - `ignoredImports`: An array of import statements or patterns that the codebase should ignore.
   * - `custom`: Any additional custom configuration that doesn't fit into the above categories.
   * - `files`: An array of file configurations, where each configuration is a tuple with the file's path and its content.
   *
   * These options provide the necessary context for the codebase to operate, enabling file parsing, dependency
   * management, code transformations, and other essential tasks.
   *
   * @example
   * const opts = {
   *   src: '/path/to/project',
   *   extensions: ['.js'],
   *   ignoredFiles: ['config.js'],
   *   files: [['/path/to/project/file1.js', 'console.log("hello world")']]
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.opts.src); // Outputs: '/path/to/project'
   */
  opts: CodebaseOpts;

  /**
   * The constructor initializes properties like `src`, `extensions`, `ignoredFiles`, `ignoredImports`, and others
   * using the values from the provided options. It also sets up the codebase's files, root directory name,
   * dependencies, and package contents.
   *
   * @param opts - Configuration options for setting up the codebase.
   * It includes properties like:
   *   - `pipeline`: An optional array of functions representing a sequence of transformations or operations.
   *   - `src`: The source directory for the codebase.
   *   - `extensions`: An array of file extensions considered by the codebase.
   *   - `ignoredFiles`: An array of file paths or patterns that the codebase should ignore.
   *   - `packageContents`: An optional object representing the contents of the project's package (e.g., package.json).
   *   - `packagePath`: An optional path to the project's package file.
   *   - `ignoredImports`: An array of import statements or patterns that the codebase should ignore.
   *   - `custom`: Any additional custom configuration that doesn't fit into the above categories.
   *   - `files`: An array of file configurations, where each configuration is a tuple with the file's path and its content.
   *
   * @example
   * const opts = {
   *   src: '/path/to/project',
   *   extensions: ['.js'],
   *   ignoredFiles: ['config.js'],
   *   files: [['/path/to/project/file1.js', 'console.log("hello world")']]
   * };
   * const codebase = new Codebase(opts);
   */
  constructor(opts: CodebaseOpts) {
    this.src = opts.src;
    this.extensions = opts.extensions;
    this.ignoredFiles = opts.ignoredFiles;
    this.ignoredImports = opts.ignoredImports;
    this.opts = opts;

    this.rootName = basename(this.src);
    this.srcWithoutRoot = dirname(this.src);

    this.files = this.storeFiles(opts.files);

    this.dependencies = [];
    this.package = opts.packageContents || {};
    this.storeDependencies();
  }

  /**
   * Returns the relative path of a file within the codebase.
   *
   * This method is useful for converting absolute paths to relative paths within the context of the codebase. It takes a file path as input
   * and removes the portion of the path that matches the root directory, leaving only the relative path.
   *
   * @param path - The absolute path of the file or directory within the file system.
   * @returns The relative path of the file or directory with respect to the root of the codebase.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   src: '/home/projects/project/'
   * };
   * const codebase = new Codebase(opts);
   * console.log(codebase.replaceRoot('/home/projects/project/path1/file1.js'));
   * // Outputs: '/path1/file1.js'
   */
  replaceRoot(path: string) {
    return path.replace(this.srcWithoutRoot, '');
  }

  /**
   * Processes and stores an array of file configurations into the codebase's `files` property.
   *
   * Each file configuration is an array consisting of the file's path and its content. This method
   * processes each configuration by creating a new `FileContainer` instance for it and then storing
   * this instance in the `files` property, indexed by the file's relative pathname.
   *
   * @param files - An array of file configurations where each configuration is a tuple with the
   * file's path and its content.
   * @returns An object representing the stored files, indexed by their relative pathnames.
   *
   * @example
   * const opts: CodebaseOpts = {
   *   // ... other options
   *   src: '/home/projects/project/',
   *   files: [
   *     ['/home/projects/project/path1.js', 'console.log("hello world")'],
   *     ['/home/projects/project/path2.js', 'console.log("goodbye world")']
   *   ]
   * };
   * const codebase = new Codebase(opts);
   * const storedFiles = codebase.storeFiles(opts.files);
   * console.log(storedFiles['/path1.js']);
   * // Outputs: Instance of FileContainer for 'path1.js'
   */
  storeFiles(files: [string, string][]) {
    this.files = {};
    files.map((record: [string, string]) => this.storeFile(record));
    return this.files;
  }

  /**
   * Extracts and returns all the `FileContainer` instances managed by the codebase.
   *
   * The `extractFiles` method provides a way to retrieve all the file instances that are currently
   * managed within the codebase's `files` property. Each `FileContainer` instance encapsulates
   * information and operations related to a specific file within the codebase.
   *
   * @returns An array of `FileContainer` instances representing all the files managed by the codebase.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const allFiles = codebase.extractFiles();
   * console.log(allFiles[0]);
   * // Outputs the `FileContainer` instance for the first file.
   */
  extractFiles(): FileContainerType[] {
    return Object.values(this.files);
  }

  /**
   * Creates and returns a new `FileContainer` instance for the provided file path and code.
   *
   * The `newFile` method offers a convenient way to create a new instance of the `FileContainer` class
   * representing a file within the codebase. This instance contains information and operations related
   * to the specified file, and it's associated with the current `Codebase` instance.
   *
   * @param path - The absolute path of the file within the file system.
   * @param code - The content of the file represented as a string.
   * @returns A new instance of the `FileContainer` class representing the specified file.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const filePath = '/home/projects/project/newFile.js';
   * const fileCode = 'console.log("This is a new file.")';
   * const newFileInstance = codebase.newFile(filePath, fileCode);
   * console.log(newFileInstance.code);
   * // Outputs: 'console.log("This is a new file.")'
   */
  newFile(path: string, code: string): FileContainer {
    return new FileContainer(path, code, this);
  }

  /**
   * Processes a file configuration and stores it in the codebase's `files` property.
   *
   * The `storeFile` method takes a file configuration, represented as a tuple of the file's `path` and its `code` (content).
   * It then creates a new `FileContainer` instance for this file and adds it to the `files` property,
   * indexed by the file's relative pathname.
   *
   * @param record - A tuple containing the absolute path of the file and its content as a string.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const fileConfig = ['/home/projects/project/path3.js', 'console.log("Another file.")'];
   * codebase.storeFile(fileConfig);
   * console.log(codebase.files['/project/path3.js'].code);
   * // Outputs: 'console.log("Another file.")'
   */
  storeFile(record: [string, string]) {
    const [path, code] = record;
    const file = this.newFile(path, code);
    this.files[file.pathname] = file;
  }

  /**
   * Removes a file from the codebase's `files` property.
   *
   * The `removeFile` method provides a way to remove a specific file from the managed collection of files
   * within the codebase.
   *
   * @param path - The relative path of the file to be removed, as it appears within the codebase's `files` property.
   *
   * @example
   * const codebase = new Codebase(opts);
   * codebase.removeFile('/project/path3.js');
   * console.log(codebase.files['/project/path3.js']);
   * // Outputs: undefined
   */
  removeFile(path: string) {
    delete this.files[path];
  }

  /**
   * Merges the properties from the given codebase to the current codebase instance.
   *
   * @param codebase - The Codebase to copy of files.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const codebase2 = new Codebase(opts);
   * codebase.copy(codebase2);
   * console.log(codebase.files === codebase2.files);
   * // Outputs: true
   */
  copy(codebase: Codebase) {
    copy(this, codebase);
  }

  /**
   * Retrieves the keys used to extract dependencies from the codebase's package property.
   *
   * This method provides the necessary keys that represent different categories of dependencies
   * in the codebase's package property, such as 'dependencies', 'devDependencies', etc.
   *
   * @returns An array of strings representing the keys under which dependencies are stored in the codebase's package property.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const depKeys = codebase.dependencyKeys();
   * console.log(depKeys);
   * // Might output: ['dependencies', 'devDependencies', 'peerDependencies']
   */
  dependencyKeys(): string[] {
    return [];
  }

  /**
   * Retrieves and stores the dependencies of the codebase based.
   *
   * @example
   * const codebase = new Codebase(opts);
   * codebase.storeDependencies();
   * console.log(codebase.dependencies);
   * // Outputs: ['lodash', 'express', ...]
   */
  storeDependencies() {
    this.dependencies = storeDependencies(this, this.dependencyKeys());
  }

  /**
   * Restructures a given file within the codebase to follow the directory pattern.
   *
   * If the file isn't named "index", this method will move it into a new directory named after the file  and rename it to "index" inside that directory. Files already named "index" remain unchanged.
   *
   * @param file - The `FileContainer` instance to be organized. It should belong to this codebase instance.
   * @returns The updated path of the file.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const fileInstance = codebase.files['/project/path1.js'];
   * const newPath = codebase.makeDirectory(fileInstance);
   * console.log(newPath);
   * // Outputs: '/project/path1/index.js'
   */
  makeDirectory(file: FileContainer) {
    return makeDirectory(this, file);
  }

  /**
   * Adds a `FileContainer` instance to the codebase's managed `files` property.
   *
   * This method provides a way to add a new file instance to the collection of files managed
   * by the codebase. The file is indexed by its relative pathname within the `files` property.
   *
   * @param file - The `FileContainer` instance representing the file to be added to the codebase.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const fileInstance = new FileContainer('/home/projects/project/newFile.js', 'console.log("New file content.")', codebase);
   * codebase.addFile(fileInstance);
   * console.log(codebase.files['/project/newFile.js'].code);
   * // Outputs: 'console.log("New file content.")'
   */
  addFile(file: FileContainer) {
    this.files[file.pathname] = file;
  }

  /**
   * Updates the codebase's `files` property with the given array of `FileContainer` instances.
   *
   * This method iterates over the provided array of `FileContainer` instances and adds each of them
   * to the codebase's managed `files` property. If a file with the same pathname already exists in the
   * `files` property, it is replaced by the new `FileContainer` instance. This allows for batch updating
   * or adding of files to the codebase.
   *
   * @param files - An array of `FileContainer` instances representing the files to be added or updated in the codebase.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const newFileInstances = [
   *   new FileContainer('/project/file1.js', 'const hi = "hello";', codebase),
   *   new FileContainer('/project/file2.js', '', codebase)
   * ];
   * codebase.updateFiles(newFileInstances);
   * console.log(codebase.files['/project/file1.js'].code);
   * // Outputs: 'const hi = "hello";'
   */
  updateFiles(files: FileContainer[]) {
    files.forEach(this.addFile.bind(this));
  }

  /**
   * Saves the given code content to a file in the file system at the specified path.
   *
   * @param pathname - The absolute path where the file should be saved.
   * @param code - The content of the file to be saved as a string.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const filePath = '/home/projects/project/savedFile.js';
   * const fileCode = 'console.log("Saved file content.")';
   * await codebase.saveFile(filePath, fileCode);
   * // This will save the file at '/home/projects/project/savedFile.js' with the given content.
   */
  saveFile(pathname: string, code: string) {
    return saveFile(pathname, code);
  }

  /**
   * Saves the given data object to a file in the file system in JSON format at the specified path.
   *
   * @param pathname - The absolute path where the JSON file should be saved.
   * @param data - The data object to be serialized and saved as a JSON file.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const jsonFilePath = '/home/projects/project/config.json';
   * const jsonData = { project: "Sample", version: "1.0.0" };
   * await codebase.saveToJSON(jsonFilePath, jsonData);
   * // This will save the data object as a JSON string to a file named 'config.json' at '/home/projects/project'
   */
  saveToJSON(pathname: string, data: RandomObject) {
    return saveToJSON(pathname, data);
  }

  /**
   * Loads a hash object into the Codebase instance, shallow copying the data by keys and values.
   *
   *
   * @param data - The data object to be assigned to the instance by key value.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const data = { project: "Sample", version: "1.0.0" };
   * await codebase.fromJson(data);
   * console.log(codebase.project == "Sample");
   * // Outputs: true;
   */
  fromJson(data: RandomObject) {
    copy(this, data);
  }

  /**
   * Loads a JSON data from a file as a hash object and assigns the hash object to the codebase.
   *
   * @param path - The pathname of the file to read.
   *
   * @example
   * const codebase = new Codebase(opts);
   * const path = '/path/to/json/file.json';
   * // the JSON in the file is { project: "Sample", version: "1.0.0" };
   * await codebase.fromFile(path);
   * console.log(codebase.project == "Sample");
   * // Outputs: true;
   */
  async fromFile(path: string) {
    await fromFile(path, this);
  }

  /**
   * Saves the content of all files in the codebase instance to the file system.
   * Each file is saved at the location specified by the `pathname` property of the respective `FileContainer` instance.
   * If the directory for the pathname doesn't exist, it is created.
   *
   * @example
   * const codebase = new Codebase(opts);
   * await codebase.toFiles();
   * // It will save all the files in the codebase instance to their respective paths on the file system.
   */
  toFiles() {
    const files = this.extractFiles();
    return Promise.all(files.map((file) => file.save()));
  }

  /**
   * Iterates over all extracted files from the `Codebase` instance and saves each one to the file system.
   * Each file is saved at its specified `pathname` with its associated content.
   *
   * @example
   * const codebase = new Codebase(opts);
   * // Assuming some files have been added or modified in the codebase
   * await codebase.save();
   * // This will save all the extracted files to their respective paths on the file system.
   */
  save() {
    return Promise.all(
      this.extractFiles().map((file: FileContainerType) => file.save())
    );
  }
}
