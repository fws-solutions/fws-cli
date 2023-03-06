#!/usr/bin/env node
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { registerCommands } from './base/helpers/registerCommands.js';
import { packageMap } from './base/helpers/packageMap.js';
import { COMMAND_TYPES } from './base/helpers/consts.js';

const commandsPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    COMMAND_TYPES.COMMANDS
);
const basicCommandsPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    COMMAND_TYPES.BASIC_COMMANDS
);

let currentPackage = packageMap();

if (currentPackage) {
    dotenv.config({ path: resolve(currentPackage.getProjectRoot(), '.env') });
}

const program = new Command();
program.version('1.0.0');
(async (commandsPath, basicCommandsPath) => {
    try {
        const [basicCommands, commands] = await Promise.all([
            await readdir(basicCommandsPath),
            currentPackage ? await readdir(commandsPath) : [],
        ]);
        await registerCommands(
            [
                { files: basicCommands, type: COMMAND_TYPES.BASIC_COMMANDS },
                { files: commands, type: COMMAND_TYPES.COMMANDS },
            ],
            currentPackage,
            program
        );
        program.parse(process.argv);
    } catch (err) {
        console.log(err);
        return;
    }
})(commandsPath, basicCommandsPath);
