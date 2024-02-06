import { readdirSync, statSync } from 'fs';
import { join } from 'path';
export const getFiles = (dir: string, fileExtension: string, fileStartWith: string): Array<string> => {
    const files: Array<string> = [];
    const readDirectory = (path: string, files: string[]) => {
        const entries = readdirSync(path);

        for (const entry of entries) {
            const filePath = join(path, entry);
            const stats = statSync(filePath);
            if (stats.isDirectory()) {
                readDirectory(filePath, files);
            } else if (stats.isFile() && entry.startsWith(fileStartWith) && entry.endsWith(fileExtension)) {
                files.push(filePath);
            }
        }
    };
    readDirectory(dir, files);
    return files;
};
