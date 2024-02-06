"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestVersion = void 0;
const package_1 = require("../package");
const latestVersion = {
    name: 'latest-version',
    description: 'check for latest CLI version',
    alias: 'latest',
    run() {
        console.log('running latest version command');
        const packageMetadata = (0, package_1.getPackageMetadata)();
        console.log(packageMetadata);
        // TODO: finish icons command
    },
};
exports.latestVersion = latestVersion;
latestVersion.run = latestVersion.run.bind(latestVersion);
