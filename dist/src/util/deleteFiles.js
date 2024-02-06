"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = void 0;
const getLogMessage_1 = require("./getLogMessage");
const fs_1 = require("fs");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const deleteFiles = (filePaths, noFilesToDeleteMsg, deleteMsg) => {
    let count = 1;
    if (!filePaths.length) {
        (0, getLogMessage_1.getLogMessage)(noFilesToDeleteMsg, 'cyan');
        return;
    }
    (0, getLogMessage_1.getLogMessage)(deleteMsg, 'red');
    filePaths.forEach((filePath) => {
        try {
            (0, fs_1.unlinkSync)(filePath);
            console.log(ansi_colors_1.default.red(` ${count++}. ${filePath}`));
        }
        catch (exception) {
            console.log(exception);
        }
    });
};
exports.deleteFiles = deleteFiles;
