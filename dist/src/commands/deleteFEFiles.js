"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFEFiles = void 0;
const package_1 = require("../package");
const getFiles_1 = require("../util/getFiles");
const deleteFiles_1 = require("../util/deleteFiles");
const path_1 = require("path");
const deleteFEFiles = {
    name: 'remove-fe',
    description: 'remove all _fe files in template-views directory',
    alias: 'rfe',
    run() {
        const packageMetadata = (0, package_1.getPackageMetadata)();
        if (!(packageMetadata === null || packageMetadata === void 0 ? void 0 : packageMetadata.isValid))
            process.exit(1);
        const feFiles = (0, getFiles_1.getFiles)((0, path_1.resolve)(packageMetadata.projectRoot, 'template-views'), '.php', '_fe-');
        (0, deleteFiles_1.deleteFiles)(feFiles, 'No FE files to delete', 'DELETED FE FILES:');
    },
};
exports.deleteFEFiles = deleteFEFiles;
deleteFEFiles.run = deleteFEFiles.run.bind(deleteFEFiles);
