import { getCommander } from './commander/commander';

const commander = getCommander();
console.log('running app.ts');
commander.parse(process.argv);
