"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePackageJson = void 0;
const getPackageJson_1 = require("./getPackageJson");
const getPackageJsonAndRootPath_1 = require("./getPackageJsonAndRootPath");
const resolvePackageJson = () => {
    const paths = (0, getPackageJsonAndRootPath_1.getPackageJsonAndRootPath)();
    if (!paths.jsonPath)
        return null;
    const packageJson = (0, getPackageJson_1.getPackageJson)(paths.jsonPath);
    return packageJson;
};
exports.resolvePackageJson = resolvePackageJson;
