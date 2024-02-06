"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmi = void 0;
const getMessageBasedOnCode_1 = require("../util/getMessageBasedOnCode");
const child_process_1 = require("child_process");
const isWin_1 = require("../util/isWin");
const package_1 = require("../package");
const npmi = {
    name: 'npmi',
    description: 'install node modules',
    alias: 'i',
    run() {
        const packageMetadata = (0, package_1.getPackageMetadata)();
        if (!(packageMetadata === null || packageMetadata === void 0 ? void 0 : packageMetadata.isValid))
            process.exit(1);
        const config = {
            stdio: 'inherit',
            cwd: packageMetadata.projectRoot,
        };
        const command = (0, isWin_1.isWin)() ? 'npm.cmd' : 'npm';
        const childProcess = (0, child_process_1.spawn)(command, ['i'], config);
        childProcess.on('close', (code) => {
            console.log((0, getMessageBasedOnCode_1.getMessageBasedOnCode)(code, 'npm install'));
            process.exit(code);
        });
    },
};
exports.npmi = npmi;
npmi.run = npmi.run.bind(npmi);
