"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommands = void 0;
const getCommands = (cliCommands, packageJsonCommands, allowedCommands) => {
    return [
        ...cliCommands.filter((command) => allowedCommands.includes(command.name)),
        ...packageJsonCommands,
    ];
};
exports.getCommands = getCommands;
