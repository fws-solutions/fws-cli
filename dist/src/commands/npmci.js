"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmci = void 0;
const getMessageBasedOnCode_1 = require("../util/getMessageBasedOnCode");
const child_process_1 = require("child_process");
const isWin_1 = require("../util/isWin");
const package_1 = require("../package");
const npmci = {
    name: 'npmci',
    description: 'clean install node modules',
    alias: 'ci',
    run() {
        const packageMetadata = (0, package_1.getPackageMetadata)();
        if (!(packageMetadata === null || packageMetadata === void 0 ? void 0 : packageMetadata.isValid))
            process.exit(1);
        const config = {
            stdio: 'inherit',
            cwd: packageMetadata.projectRoot,
        };
        const command = (0, isWin_1.isWin)() ? 'npm.cmd' : 'npm';
        const childProcess = (0, child_process_1.spawn)(command, ['ci'], config);
        childProcess.on('close', (code) => {
            console.log((0, getMessageBasedOnCode_1.getMessageBasedOnCode)(code, 'npm clean install'));
            process.exit(code);
        });
    },
};
exports.npmci = npmci;
npmci.run = npmci.run.bind(npmci);
