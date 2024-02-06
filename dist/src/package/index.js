"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageMetadata = void 0;
const getPackageJsonAndRootPath_1 = require("../util/getPackageJsonAndRootPath");
const resolvePackageJson_1 = require("../util/resolvePackageJson");
const getPackageType_1 = require("../util/getPackageType");
const getAssetsDir_1 = require("../util/getAssetsDir");
const getPackageMetadata = () => {
    const paths = (0, getPackageJsonAndRootPath_1.getPackageJsonAndRootPath)();
    const packageJson = (0, resolvePackageJson_1.resolvePackageJson)();
    const packageType = (0, getPackageType_1.getPackageType)(packageJson);
    if (!paths || !paths.jsonPath || !paths.rootPath || !packageJson || !packageType || packageType === 'unknown')
        return {
            projectRoot: '',
            packageJsonDir: '',
            assetsDir: '',
            packageType: '',
            packageJson: null,
            isValid: false,
        };
    return {
        projectRoot: paths === null || paths === void 0 ? void 0 : paths.rootPath,
        packageJsonDir: paths === null || paths === void 0 ? void 0 : paths.jsonPath,
        assetsDir: (0, getAssetsDir_1.getAssetsDir)(packageType, paths.rootPath),
        packageType: packageType,
        packageJson: packageJson,
        isValid: true,
    };
};
exports.getPackageMetadata = getPackageMetadata;
