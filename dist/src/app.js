"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("./commander/commander");
const commander = (0, commander_1.getCommander)();
console.log('running app.ts');
commander.parse(process.argv);
