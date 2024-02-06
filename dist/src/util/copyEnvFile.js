"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyEnvFile = void 0;
const fs_1 = require("fs");
const getLogMessage_1 = require("./getLogMessage");
const copyEnvFile = (template, envPath, message, fileName) => {
    if (!(0, fs_1.existsSync)(envPath)) {
        try {
            (0, fs_1.copyFileSync)(template, envPath);
            (0, getLogMessage_1.getLogMessage)(`Generated '${fileName}' file in the root of the ${message}`, 'cyan');
        }
        catch (exception) {
            console.log(exception);
        }
    }
    else {
        (0, getLogMessage_1.getLogMessage)(`WARNING: '${fileName}' already exists!`, 'yellow');
    }
};
exports.copyEnvFile = copyEnvFile;
