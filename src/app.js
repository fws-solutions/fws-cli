#!/usr/bin/env node
import { getCommander } from './commander/commander.js';
import { getLogMessageInline } from './util/getLogMessageInline.js';

const commander = getCommander();
const command = process.argv[2] ?? '';
if (command) {
    getLogMessageInline(`Starting ${command} command...`, 'cyan');
}
commander.parse(process.argv);
