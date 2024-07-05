import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { Codebase } from '../index.js';
import type { RandomObject } from '../../../types.js';
import type { FileContainer } from '../file/index.js';

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
 * await fromFile('/path/to/data.json', codebase);
 * // If the file '/path/to/data.json' contains valid JSON,
 * // the codebase object will be updated using that data.
 */
export const fromFile = async (pathname: string, codebase: Codebase) => {
  try {
    const data = await readFile(pathname, { encoding: 'utf-8' });
    const jsonData: Record<string, unknown> = JSON.parse(data);
    codebase.fromJson(jsonData);
  } catch (error) {
    console.error('Could not parse data:', error);
  }
};

/**
 * Saves the content of a `FileContainer` instance to a file on the file system.
 * The file will be saved at the location specified by the `pathname` property of the `FileContainer`.
 * If the directory for the pathname doesn't exist, it will be created.
 *
 * @param file - The `FileContainer` instance containing the data to be saved.
 * @example
 * const fileContainer = new FileContainer('/path/to/file.js', 'console.log("Hello");', codebase);
 * await toFile(fileContainer);
 * // This will save the content of `fileContainer` to a file named 'file.js' at '/path/to'
 */
export const toFile = async (file: FileContainer) => {
  const { pathname: path, code } = file;
  return createDir(path, code);
};
