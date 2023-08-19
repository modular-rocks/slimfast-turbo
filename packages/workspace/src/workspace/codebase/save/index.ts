import { readFile } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

import type { Codebase } from '..';
import type { RandomObject } from '../../../types';
import type { FileContainer } from '../file';

/**
 * Creates a directory on the file system for the provided pathname and writes the contents to a file within that directory.
 * If the directory doesn't exist, it will be created. After creating the directory,
 * the contents are written to a file at the specified pathname.
 *
 * @param pathname - The path where the file should be created, including the file name.
 * @param contents - The contents to be written to the file.
 * @example
 * // Assuming the directory '/path/to' doesn't exist
 * await createDir('/path/to/file.txt', 'Hello, World!');
 * // This will create a directory '/path/to' and a file 'file.txt' with the contents 'Hello, World!'
 */
export const createDir = async (pathname: string, contents: string) => {
  const folder = dirname(pathname);
  try {
    await mkdir(folder, { recursive: true });
    await writeFile(pathname, contents);
  } catch (err) {
    console.error(err);
  }
};

// TODO: do we need this?
/**
 * Converts a given object into its JSON string representation.
 *
 * @param data - The object to be converted to a JSON string.
 * @returns The JSON string representation of the provided data.
 *
 * @example
 * const data = { key: 'value', array: [1, 2, 3] };
 * const jsonString = objectToJsonString(data);
 * console.log(jsonString); // Outputs: '{"key":"value","array":[1,2,3]}'
 */
export const toJson = (data: RandomObject) => {
  return JSON.stringify(data);
};

/**
 * Saves the provided code to a file on the file system at the specified pathname.
 * If the directory for the pathname doesn't exist, it will be created.
 *
 * @param pathname - The path where the file should be saved, including the file name.
 * @param code - The code or content to be saved to the file.
 *
 * @example
 * await saveFile('/path/to/file.txt', 'Hello, World!');
 * // This will save the text 'Hello, World!' to a file named 'file.txt' at '/path/to'
 */
export const saveFile = (pathname: string, code: string) => {
  return createDir(pathname, code);
};

// TODO: check if this is needed
// TODO: maybe validate that the path contains a json file extension
/**
 * Saves the provided data as a JSON string to a file on the file system at the specified pathname.
 * If the directory for the pathname doesn't exist, it will be created.
 *
 * @param pathname - The path where the JSON file should be saved, including the file name.
 * @param data - The data object to be serialized and saved as JSON.
 *
 * @example
 * const data = { key: 'value', array: [1, 2, 3] };
 * await saveToJSON('/path/to/data.json', data);
 * // This will save the object as a JSON string to a file named 'data.json' at '/path/to'
 */
export const saveToJSON = async (pathname: string, data: RandomObject) => {
  await createDir(pathname, toJson(data));
};

/**
 * Reads a JSON file from the file system at the provided pathname, parses its content,
 * and updates the given `codebase` instance using the parsed data.
 *
 * @param pathname - The path to the file that should be read.
 * @param codebase - The codebase object to be updated with the parsed data.
 *
 * @example
 * const codebase = new Codebase();
 * fromFile('/path/to/data.json', codebase);
 * // If the file '/path/to/data.json' contains valid JSON,
 * // the codebase object will be updated using that data.
 */
export const fromFile = (pathname: string, codebase: Codebase) => {
  readFile(pathname, { encoding: 'utf-8' }, function (err: NodeJS.ErrnoException | null, data: string) {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const jsonData: Record<string, unknown> = JSON.parse(data);
      // TODO: should it run on the codebase instance or just using utility functions?
      codebase.fromJson(jsonData);
    } catch (parseError) {
      console.error('Could not parse data:', parseError);
    }
  });
};

/**
 * Saves the content of a `FileContainer` instance to a file on the file system.
 * The file will be saved at the location specified by the `pathname` property of the `FileContainer`.
 * If the directory for the pathname doesn't exist, it will be created.
 *
 * @param file - The `FileContainer` instance containing the data to be saved.
 * @example
 * const fileContainer = new FileContainer('/path/to/file.js', 'console.log("Hello");', codebase);
 * toFile(fileContainer);
 * // This will save the content of `fileContainer` to a file named 'file.js' at '/path/to'
 */
export const toFile = async (file: FileContainer) => {
  const { pathname: path, code } = file;
  return createDir(path, code);
};

// TODO: add jsdocs
// TODO: ensure implementation (used in a method of the Codebase class), I'm not sure about the desired behavior
export const fromJson = (data: RandomObject, codebase: Codebase) => {
  Object.keys(data).forEach((key: string) => {
    Object.defineProperty(codebase, key, {
      value: data[key],
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });
};
