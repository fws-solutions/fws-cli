"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJson = void 0;
const fs_1 = require("fs");
const getPackageJson = (path) => {
    try {
        const packageJson = JSON.parse((0, fs_1.readFileSync)(path, 'utf-8'));
        return packageJson;
    }
    catch (e) {
        return {};
    }
};
exports.getPackageJson = getPackageJson;
