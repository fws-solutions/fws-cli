#!/usr/bin/env node
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import {readdir} from 'fs';
const commands = resolve(dirname(fileURLToPath(import.meta.url)), 'commands');
import { Command } from 'commander';
import BaseCommand from "./base/domain/Command/BaseCommand.js";
import fancyLog from'fancy-log';
import colors from 'ansi-colors';
import StringHelpers from "./base/helpers/StringHelpers.js";

const program = new Command();
program.version('1.0.0');

readdir(commands, async function (err, files) {
    if (err) return;
    for (let file of files) {
        let module;
        try {
            file = './commands/' + file;
            module = await import(file);
            module = new module.default();
        } catch (exception) {
            fancyLog(colors.red(exception));
            process.exit(1);
        }

        if (!(module instanceof BaseCommand)) throw new Error(`This file is not a proper command: ${file}`);

        const commandName = module.getDefinition().name;
        const mandatoryArguments = module.getDefinition().hasMandatoryArguments()
            ? module.getDefinition().mandatoryArguments.map((parameter) => `<${parameter.name}>`).reduce((accumulator, parameterName) => `${accumulator} ${parameterName}`)
            : '';
        const optionalArguments = module.getDefinition().hasOptionalArguments()
            ? module.getDefinition().mandatoryArguments.map((parameter) => `[${parameter.name}]`).reduce((accumulator, parameterName) => `${accumulator} ${parameterName}`)
            : '';
        const alias = module.getDefinition().hasAlias()
            ? module.getDefinition().alias
            : '';

        const command = program
            .command(`${commandName}`)
            .arguments(`${mandatoryArguments} ${optionalArguments}`);

        if (module.getDefinition().hasMandatoryOptions()) {
            module.getDefinition().mandatoryOptions.forEach((parameter) => {
                const description = parameter.hasAvailableValues()
                    ? `${parameter.description} (choices: ${parameter.availableValues.join(', ')})`
                    : parameter.description;
                command.requiredOption(`-${parameter.shortName}, --${parameter.name} ${parameter.flag ? '' : `<${parameter.name}>`}`, description);
            });
        }

        if (module.getDefinition().hasOptionalOptions()) {
            module.getDefinition().optionalOptions.forEach((parameter) => {
                const description = parameter.hasAvailableValues()
                    ? `${parameter.description} (choices: ${parameter.availableValues.join(', ')})`
                    : parameter.description;
                command.option(`-${parameter.shortName}, --${parameter.name} ${parameter.flag ? '' : `[${parameter.name}]`}`, description);
            });
        }

        command
            .description(module.getDefinition().description)
            .action(async () => {
                const args = command.args;

                if (module.getDefinition().hasMandatoryArguments()) {
                    let inboundMandatoryArguments = [];
                    inboundMandatoryArguments = args.slice(0, module.getDefinition().mandatoryArguments.length);
                    for (let index = 0; index < inboundMandatoryArguments.length; index++) {
                        module.getDefinition().mandatoryArguments[index].setValue(inboundMandatoryArguments[index]);
                    }
                    args.splice(0, module.getDefinition().mandatoryArguments.length)
                }
                const inboundOptionalArguments = args || [];
                for (let index = 0; index < inboundOptionalArguments.length; index++) {
                    module.getDefinition().optionalArguments[index].setValue(inboundOptionalArguments[index]);
                }

                module.getDefinition().mandatoryOptions.forEach((parameter) => {
                    parameter.setValue(command[StringHelpers.dashCaseToCamelCase(parameter.name)]);
                });

                module.getDefinition().optionalOptions.forEach((parameter) => {
                    if (command.hasOwnProperty(StringHelpers.dashCaseToCamelCase(parameter.name))) parameter.setValue(command[StringHelpers.dashCaseToCamelCase(parameter.name)]);
                });

                module.showStartMessage();
                module.validateInputParameters();
                await module.run();
                module.showEndMessage();
            })
            .alias(alias);
    }

    program.parse(process.argv);
});
