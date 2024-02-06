"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const getFiles = (dir, fileExtension, fileStartWith) => {
    const files = [];
    const readDirectory = (path, files) => {
        const entries = (0, fs_1.readdirSync)(path);
        for (const entry of entries) {
            const filePath = (0, path_1.join)(path, entry);
            const stats = (0, fs_1.statSync)(filePath);
            if (stats.isDirectory()) {
                readDirectory(filePath, files);
            }
            else if (stats.isFile() && entry.startsWith(fileStartWith) && entry.endsWith(fileExtension)) {
                files.push(filePath);
            }
        }
    };
    readDirectory(dir, files);
    return files;
};
exports.getFiles = getFiles;
