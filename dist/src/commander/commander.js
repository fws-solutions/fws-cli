"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommander = void 0;
const commander_1 = require("commander");
const resolvePackageJson_1 = require("../util/resolvePackageJson");
const getAllowedCommands_1 = require("../util/getAllowedCommands");
const package_json_1 = require("../../package.json");
const packageJsonCommands_1 = require("../commands/packageJsonCommands");
const getCommands_1 = require("../util/getCommands");
const commands_1 = require("../commands");
const getAdditionalOptions_1 = require("../util/getAdditionalOptions");
const getRequiredOptions_1 = require("../util/getRequiredOptions");
const getCommander = () => {
    const program = new commander_1.Command();
    const packageJson = (0, resolvePackageJson_1.resolvePackageJson)();
    const allowedCommands = (0, getAllowedCommands_1.getAllowedCommands)(packageJson);
    const packageJsonCommands = (0, packageJsonCommands_1.getPackageJsonCommands)();
    program.version(package_json_1.version);
    const commands = (0, getCommands_1.getCommands)(commands_1.commands, packageJsonCommands, allowedCommands);
    commands.forEach((command) => {
        const cmd = program.command(command.name);
        cmd.description(command.description);
        command.alias && cmd.alias(command.alias);
        (0, getRequiredOptions_1.getRequiredOptions)(command).forEach((option) => {
            cmd.requiredOption(option.command, option.description);
        });
        (0, getAdditionalOptions_1.getAdditionalOptions)(command).forEach((option) => {
            cmd.option(option.command, option.description);
        });
        cmd.action(command.run);
    });
    return program;
};
exports.getCommander = getCommander;
