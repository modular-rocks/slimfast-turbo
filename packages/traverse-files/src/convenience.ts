import path from 'path';
import { readFileSync, statSync, readdirSync } from 'fs';

export const read = (path: string): string => readFileSync(path).toString();
export const resolve = (dirname: string, filename: string): string => path.resolve(dirname, filename);
export const readFilesInDirectory = (directoryPath: string): string[] => readdirSync(directoryPath);
export const isDirectory = (absolutePath: string): boolean => statSync(absolutePath).isDirectory();
