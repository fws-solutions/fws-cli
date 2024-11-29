#!/usr/bin/env node
import { getCommander } from './commander/commander.js';
import { getLogMessageInline } from './util/getLogMessageInline.js';
import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import { isWin } from './util/isWin.js';

const MIN_VERSION = 22;
const currentVersion = parseInt(process.version.slice(1).split('.')[0]);

const commander = getCommander();
const command = process.argv[2] ?? '';
const npxPath = isWin() ? execSync('where npx').toString().trim() : execSync('which npx').toString().trim();
if (command) {
    getLogMessageInline(`Starting ${command} command...`, 'cyan');
}
if (currentVersion < MIN_VERSION) {
    const scriptPath = path.join(process.cwd(), 'src', 'app.js');
    const npxProcess = spawn(npxPath, ['-p', `node@${MIN_VERSION}`, 'node', scriptPath, ...process.argv.slice(2)], {
        stdio: 'inherit',
    });

    npxProcess.on('exit', (code) => {
        process.exit(code);
    });
    npxProcess.on('error', (error) => {
        console.error(error);
    });
} else {
    commander.parse(process.argv);
}
