import { readFile } from 'fs/promises';
import { normalize } from 'path';

import mockFs from 'mock-fs';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { FileContainer as FileContainerBase, FileHandler } from './file';

import { Codebase as CodebaseBase } from '.';

import type { CodebaseOpts } from '../../types';

export class FileHandlerCustom implements FileHandler {
  private fileContainer: FileContainerBase | null = null;

  private codebase: CodebaseBase | null = null;

  assignFileContainer(fileContainer: FileContainerBase): this {
    this.fileContainer = fileContainer;
    return this;
  }

  assignCodebase(codebase: CodebaseBase): this {
    this.codebase = codebase;
    return this;
  }

  tooSimple(): Boolean {
    return false;
  }

  addImport(importStatement?: any) {
    return false;
  }

  codeToAST() {
    return {};
  }

  astToCode() {
    return '';
  }
}

class Codebase extends CodebaseBase<FileHandlerCustom> {
  constructor(opts: CodebaseOpts) {
    super(new FileHandlerCustom(), opts);
  }
}

class FileContainer extends FileContainerBase<FileHandlerCustom> {
  constructor(path: string, code: string, codebase: Codebase) {
    super(new FileHandlerCustom(), path, code, codebase);
  }
}

describe('Codebase', () => {
  const files: [string, string][] = [1, 2, 3].map((x: number) => [
    `/home/projects/project/file-${x}.js`,
    '',
  ]);
  const pipeline: Function[] = [];

  const opts: CodebaseOpts = {
    pipeline,
    files,
    src: '/home/projects/project/',
    extensions: [],
    ignoredFiles: [],
    ignoredImports: [],
    packageContents: {},
  };

  test('creates a "Codebase" instance correctly', async () => {
    const codebase = new Codebase(opts);

    expect(codebase.src).toBe('/home/projects/project/');
    expect(codebase.rootName).toBe('project');
    expect(codebase.srcWithoutRoot).toBe('/home/projects');
    expect(codebase.extensions).toEqual([]);
    expect(codebase.ignoredFiles).toEqual([]);
    expect(codebase.ignoredImports).toEqual([]);
    expect(codebase.opts).toEqual(opts);
    expect(codebase.package).toEqual({});
    expect(codebase.dependencies).toEqual([]);
    // files
    expect(codebase.files['/project/file-1.js'].code).toBe('');
    expect(codebase.files['/project/file-2.js'].code).toBe('');
    expect(codebase.files['/project/file-3.js'].code).toBe('');
  });

  test('should remove a file from the files property', () => {
    const codebase = new Codebase(opts);

    expect(codebase.files).toHaveProperty('/project/file-1.js');

    codebase.removeFile('/project/file-1.js');

    expect(codebase.files).not.toHaveProperty('/project/file-1.js');
  });

  test('should copy from another "Codebase" instance', () => {
    const codebase = new Codebase(opts);

    // Create a second Codebase instance
    const newFiles: [string, string][] = [['/project/new-file.js', '']];
    const secondCodebase = new Codebase({
      ...opts,
      files: newFiles,
      src: '/home/projects/project2/',
    });

    // check the original file is not in the first codebase instance
    expect(codebase.files).not.toHaveProperty('/project/new-file.js');
    // check the original src is not in the first codebase instance
    expect(codebase.src).not.toBe('/home/projects/project2/');

    codebase.copy(secondCodebase);

    // check the file from the second instace is now in the first codebase instance
    expect(codebase.files).toHaveProperty('/project/new-file.js');
    // check the src from the second instace is now in the first codebase instance
    expect(codebase.src).toBe('/home/projects/project2/');
  });

  test('should restructure a file to follow the directory pattern', () => {
    const codebase = new Codebase({
      ...opts,
      files: [['/project/new-file.js', 'console.log("newfile");']],
    });

    // Ensure the file is present
    expect(codebase.files).toHaveProperty('/project/new-file.js');

    const fileInstance = codebase.files['/project/new-file.js'];
    const newPath = codebase.makeDirectory(fileInstance);

    const normalizedPath = normalize(newPath);

    // Ensure the file is now reestructured
    expect(codebase.files).toHaveProperty(normalizedPath);
    expect(codebase.files[normalizedPath].code).toBe('console.log("newfile");');

    // Ensure the old file is not present
    expect(codebase.files).not.toHaveProperty('/project/new-file.js');
  });

  test('should add a file to the codebase using the addFile method', () => {
    const codebase = new Codebase(opts);

    const sampleFile = new FileContainer(
      '/project/new-file.js',
      'console.log("New file content.");',
      codebase
    );

    codebase.addFile(sampleFile);

    // Ensure the file is present
    expect(codebase.files).toHaveProperty('/project/new-file.js');
    expect(codebase.files['/project/new-file.js'].code).toBe(
      'console.log("New file content.");'
    );
  });

  test('should update the codebase with an array of FileContainer instances using the "updateFiles" method', () => {
    const initialFiles: [string, string][] = [
      ['/project/initialFile.js', 'console.log("Initial file content.");'],
    ];
    const codebase = new Codebase({ ...opts, files: initialFiles });

    // Ensure the initial file is present
    expect(codebase.files).toHaveProperty('/project/initialFile.js');
    expect(codebase.files['/project/initialFile.js'].code).toBe(
      'console.log("Initial file content.");'
    );

    // Create an array of FileContainer instances to update the codebase
    const newFileInstances = [
      new FileContainer(
        '/project/initialFile.js',
        'console.log("Updated file content.");',
        codebase
      ),
      new FileContainer(
        '/project/newFile.js',
        'console.log("New file content.");',
        codebase
      ),
    ];

    // Update the codebase
    codebase.updateFiles(newFileInstances);

    // Verify that the initial file has been updated
    expect(codebase.files).toHaveProperty('/project/initialFile.js');
    expect(codebase.files['/project/initialFile.js'].code).toBe(
      'console.log("Updated file content.");'
    );

    // Verify that the new file has been added
    expect(codebase.files).toHaveProperty('/project/newFile.js');
    expect(codebase.files['/project/newFile.js'].code).toBe(
      'console.log("New file content.");'
    );
  });

  test('should set "package" based on "packageContents" if provided', () => {
    const customPackageContents = { name: 'TestApp', version: '2.0.0' };
    const customOpts = { ...opts, packageContents: customPackageContents };
    const codebase = new Codebase(customOpts);

    expect(codebase.package).toEqual(customPackageContents);
  });

  test('should default "package" to an empty object if "packageContents" is not provided', () => {
    const customOpts = { ...opts };
    delete customOpts.packageContents; // Ensure packageContents is not provided
    const codebase = new Codebase(customOpts);

    expect(codebase.package).toEqual({});
  });

  describe("Codebase's file system methods", () => {
    beforeEach(() => {
      mockFs({
        './path/to': {},
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    test('should save all the extracted files from the Codebase instance to the file system using the "save" method', async () => {
      // Mock the file system
      const files2: [string, string][] = [
        ['./path/to/file1.js', 'console.log("File 1 content.");'],
        ['./path/to/file2.js', 'console.log("File 2 content.");'],
      ];

      // Create an instance of the Codebase class and add or modify files
      const codebase = new Codebase({
        ...opts,
        src: process.cwd(),
        files: files2,
      });

      // Use the save method to save all the files to the file system
      await codebase.save();

      // Verify that the files have been correctly saved to the file system
      const savedContent1 = await readFile('./path/to/file1.js', 'utf8');
      const savedContent2 = await readFile('./path/to/file2.js', 'utf8');

      expect(savedContent1).toBe('console.log("File 1 content.");');
      expect(savedContent2).toBe('console.log("File 2 content.");');
    });

    test('should save the given content to a file in the file system using the "saveFile" method', async () => {
      const codebase = new Codebase(opts);

      const filePath = './path/to/savedFile.js';
      const fileCode = 'console.log("Saved file content.");';

      // Use the saveFile method
      await codebase.saveFile(filePath, fileCode);

      // Read the file from the file system to verify the content
      const savedContent = await readFile(filePath, 'utf8');
      expect(savedContent).toBe(fileCode);
    });

    test('should save the given data object to a JSON file in the file system using the "saveToJSON" method', async () => {
      const codebase = new Codebase(opts);

      const jsonFilePath = './path/to/config.json';
      const jsonData = { project: 'Sample', version: '1.0.0' };

      await codebase.saveToJSON(jsonFilePath, jsonData);

      // Read the JSON file from the file system and parse its content to verify the data
      const savedContent = JSON.parse(await readFile(jsonFilePath, 'utf8'));
      expect(savedContent).toEqual(jsonData);
    });

    test('should save the content of FileContainer instances to the file system using the toFiles method', async () => {
      const sampleFiles: [string, string][] = [
        ['./path/to/toFilesTest1.js', 'console.log("File 1 content.");'],
        ['./path/to/toFilesTest2.js', 'console.log("File 2 content.");'],
      ];
      const codebase = new Codebase({ ...opts, files: sampleFiles });

      await codebase.toFiles();

      // Read the files from the file system to verify the content
      const savedContent1 = await readFile('./path/to/toFilesTest1.js', 'utf8');
      const savedContent2 = await readFile('./path/to/toFilesTest2.js', 'utf8');

      expect(savedContent1).toBe('console.log("File 1 content.");');
      expect(savedContent2).toBe('console.log("File 2 content.");');
    });

    test('should load JSON data from a file and assign it to the codebase using the "fromFile" method', async () => {
      // Mock the file system
      const jsonFilePath = './path/to/json/file.json';
      const jsonData = {
        src: '/new/src/path/',
        package: {
          name: 'Sample',
          version: '1.0.0',
        },
      };

      mockFs({
        [jsonFilePath]: JSON.stringify(jsonData),
      });

      const codebase = new Codebase(opts);

      // Use the fromFile method to load the JSON data
      await codebase.fromFile(jsonFilePath);

      // Verify that the properties of the Codebase instance have been updated
      expect(codebase.src).toBe('/new/src/path/');
      expect(codebase).toHaveProperty('package');
      expect(codebase.package.name).toBe('Sample');
      expect(codebase.package.version).toBe('1.0.0');

      mockFs.restore();
    });
  });
});
