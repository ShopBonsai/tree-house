import * as fs from 'fs';

/**
 * Read multiple files from a directory and place json content onto key/value object
 * @param {String} directory
 */
export function readFiles(directory: string) {
  return fs.readdirSync(directory).reduce((prev, currentFile) => {
    const fileBuffer: any = fs.readFileSync(`${directory}/${currentFile}`);
    return { ...prev, [currentFile.replace(/\.json$/, '')]: JSON.parse(fileBuffer) };
  }, {});
}
