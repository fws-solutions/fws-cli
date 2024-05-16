import { getCommander } from './commander/commander';
import { getLogMessageInline } from './util/getLogMessageInline';

const commander = getCommander();
const command = process.argv[2] ?? '';
if (command) {
    getLogMessageInline(`Starting ${command} command...`, 'cyan');
}
commander.parse(process.argv);
