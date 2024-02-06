"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsDir = void 0;
const path_1 = require("path");
const getAssetsDir = (packageType, rootPath) => {
    return ['vue', 'wp'].includes(packageType)
        ? (0, path_1.resolve)(rootPath, 'src/assets')
        : ['next', 'nuxt'].includes(packageType)
            ? (0, path_1.resolve)(rootPath, 'assets')
            : '';
};
exports.getAssetsDir = getAssetsDir;
