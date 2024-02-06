"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJsonCommands = void 0;
const getMessageBasedOnCode_1 = require("../util/getMessageBasedOnCode");
const isWin_1 = require("../util/isWin");
const resolvePackageJson_1 = require("../util/resolvePackageJson");
const child_process_1 = require("child_process");
const package_1 = require("../package");
const getPackageJsonCommands = () => {
    const packageJson = (0, resolvePackageJson_1.resolvePackageJson)();
    const scripts = packageJson === null || packageJson === void 0 ? void 0 : packageJson.scripts;
    if (!scripts || !Object.keys(scripts).length)
        return [];
    const commandList = [];
    Object.keys(scripts).forEach((script) => {
        if (script === 'postinstall')
            return;
        const command = {
            name: script,
            description: `runs the ${script} script`,
            run: () => {
                const packageMetadata = (0, package_1.getPackageMetadata)();
                if (!(packageMetadata === null || packageMetadata === void 0 ? void 0 : packageMetadata.isValid))
                    process.exit(1);
                const config = {
                    stdio: 'inherit',
                    cwd: packageMetadata.projectRoot,
                };
                const commandToRun = (0, isWin_1.isWin)() ? 'npm.cmd' : 'npm';
                const childProcess = (0, child_process_1.spawn)(commandToRun, ['run', script], config);
                childProcess.on('close', (code) => {
                    console.log((0, getMessageBasedOnCode_1.getMessageBasedOnCode)(code, script));
                    process.exit(code);
                });
            },
        };
        commandList.push(command);
    });
    return commandList;
};
exports.getPackageJsonCommands = getPackageJsonCommands;
