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
import WordPressPackage from "./base/domain/Package/WordPressPackage.js";
import VuePackage from "./base/domain/Package/VuePackage.js";
import NuxtPackage from "./base/domain/Package/NuxtPackage.js";
import NextPackage from "./base/domain/Package/NextPackage.js";
import { spawn } from 'child_process';
import * as dotenv from 'dotenv';

let currentPackage;
if (new WordPressPackage().is()) currentPackage = new WordPressPackage();
else if (new VuePackage().is()) currentPackage = new VuePackage();
else if (new NuxtPackage().is()) currentPackage = new NuxtPackage();
else if (new NextPackage().is()) currentPackage = new NextPackage();

if (currentPackage) {
    dotenv.config({path : resolve(currentPackage.getProjectRoot(), '.env')});
}

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

                if (!module.getDefinition().isStandAlone) module.showStartMessage();

                module.validateInputParameters();
                await module.run();
                if (!module.getDefinition().isStandAlone) module.showEndMessage();
            })
            .alias(alias);
    }
    if (currentPackage) {
        const packageJson = currentPackage.getPackageJson();
        for (const command in packageJson.scripts) {
            if (command === 'postinstall') continue;
            program
                .command(`${command}`)
                .description(`${packageJson.scripts[command]}`)
                .action(() => {
                    const script = spawn(
                        /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
                        ['run', command],
                        {
                            stdio: 'inherit',
                            cwd: currentPackage.getProjectRoot()
                        }
                    );
                    script.on('close', (code) => {
                        process.exit(code);
                    });
                });
        }
    }

    program.parse(process.argv);
});
