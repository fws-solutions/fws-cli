"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInstall = void 0;
const package_1 = require("../package");
const path_1 = require("path");
const copyEnvFile_1 = require("../util/copyEnvFile");
const getEnvTemplate_1 = require("../util/getEnvTemplate");
const postInstall = {
    name: 'postinstall',
    description: 'runs postinstall script',
    alias: 'pi',
    run() {
        const packageMetadata = (0, package_1.getPackageMetadata)();
        if (!(packageMetadata === null || packageMetadata === void 0 ? void 0 : packageMetadata.isValid))
            process.exit(1);
        const message = packageMetadata.packageType === 'wp' ? 'theme directory' : 'Nuxt project';
        const env = (0, path_1.resolve)(packageMetadata.projectRoot, '.env');
        const exampleEnv = (0, path_1.resolve)(packageMetadata.projectRoot, '.env.example');
        const envTemplate = (0, getEnvTemplate_1.getEnvTemplate)(packageMetadata.packageType);
        (0, copyEnvFile_1.copyEnvFile)(envTemplate, exampleEnv, message, '.env-example');
        (0, copyEnvFile_1.copyEnvFile)(envTemplate, env, message, '.env');
    },
};
exports.postInstall = postInstall;
postInstall.run = postInstall.run.bind(postInstall);
