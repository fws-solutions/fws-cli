#!/usr/bin/env node
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import {readdir} from 'fs';
const commands = resolve(dirname(fileURLToPath(import.meta.url)), 'commands');
import { Command } from 'commander';
import BaseCommand from "./base/domain/Command/BaseCommand.js";
import fancyLog from'fancy-log';
import colors from 'ansi-colors';

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
        const mandatoryParameters = module.getDefinition().hasMandatoryParameters()
            ? module.getDefinition().mandatoryParameters.map((parameter) => `<${parameter}>`).reduce((accumulator, parameter) => `${accumulator} ${parameter}`)
            : '';
        const optionalParameters = module.getDefinition().hasOptionalParameters()
            ? module.getDefinition().optionalParameters.map((parameter) => `[${parameter}]`).reduce((accumulator, parameter) => `${accumulator} ${parameter}`)
            : '';

        program
            .command(`${commandName} ${mandatoryParameters} ${optionalParameters}`)
            .description(module.getDefinition().description)
            .action(async (...parameters) => {
                module.run(...parameters);
            });
    }

    program.parse(process.argv);
});
