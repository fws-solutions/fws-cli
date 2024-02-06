"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJsonAndRootPath = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const getPackageJsonAndRootPath = () => {
    try {
        if ((0, fs_1.existsSync)((0, path_1.resolve)(process.cwd(), 'wp-content', 'themes'))) {
            const themesDir = (0, fs_1.readdirSync)((0, path_1.resolve)(process.cwd(), 'wp-content', 'themes'));
            if (themesDir.length) {
                const theme = themesDir.find((dir) => dir.startsWith('fws-'));
                if (theme) {
                    return {
                        jsonPath: (0, path_1.resolve)(process.cwd(), 'wp-content', 'themes', theme, 'package.json'),
                        rootPath: (0, path_1.resolve)(process.cwd(), 'wp-content', 'themes', theme),
                    };
                }
            }
        }
        return { jsonPath: (0, path_1.resolve)(process.cwd(), 'package.json'), rootPath: (0, path_1.resolve)(process.cwd()) };
    }
    catch (err) {
        console.log(err);
        return { jsonPath: '', rootPath: '' };
    }
};
exports.getPackageJsonAndRootPath = getPackageJsonAndRootPath;
