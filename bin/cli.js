#!/usr/bin/env node
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import {readdir} from 'fs';
const commands = resolve(dirname(fileURLToPath(import.meta.url)), "../", 'commands');
import { Command } from 'commander';
import BaseCommand from "../base/domain/Command/BaseCommand.js";

const program = new Command();
program.version('2.0.0');

readdir(commands, async function (err, files) {
    if (err) return;
    for (let file of files) {
        let module;
        try {
            file = './../commands/' + file;
            module = await import(file);
            module = new module.default();
        } catch (exception) {
            throw new Error(`This file in the command directory is causing problems: ${file}`);
        }

        if (!(module instanceof BaseCommand)) throw new Error(`This file is not a proper command: ${file}`);

        const commandName = module.getDefinition().name;
        const mandatoryParameters = module.getDefinition().mandatoryParameters.map((parameter) => `<${parameter}>`).reduce((accumulator, parameter) => `${accumulator} ${parameter}`);
        const optionalParameters = module.getDefinition().optionalParameters.map((parameter) => `[${parameter}]`).reduce((accumulator, parameter) => `${accumulator} ${parameter}`);

        program
            .command(`${commandName} ${mandatoryParameters} ${optionalParameters}`)
            .description(module.getDefinition().description)
            .action(async (...parameters) => {
                module.run(...parameters);
            });
    }

    program.parse(process.argv);
});
