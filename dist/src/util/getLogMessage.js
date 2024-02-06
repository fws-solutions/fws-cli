"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogMessage = void 0;
const fancy_log_1 = __importDefault(require("fancy-log"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const lodash_template_1 = __importDefault(require("lodash.template"));
const fs_1 = require("fs");
const getLogMessage = (message, color) => {
    const appRoot = __dirname.split('src')[0];
    const template = (0, fs_1.readFileSync)(`${appRoot}src/templates/other/temp-cli-log.txt`, 'utf8');
    const compiled = (0, lodash_template_1.default)(template);
    (0, fancy_log_1.default)(ansi_colors_1.default[color](compiled({ message: message })));
};
exports.getLogMessage = getLogMessage;
