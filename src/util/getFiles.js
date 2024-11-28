import { readdirSync, statSync } from 'fs';
import { join } from 'path';
export const getFiles = (dir, fileExtension, fileStartWith) => {
    const files = [];
    const readDirectory = (path, files) => {
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
