#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const commands = path.resolve(__dirname, "./../", 'commands');
const bootstrap = async () => {
    // # Initializes all commands
    fs.readdir(commands, async function (err, files) {
        if (err) return;
        for (const file of files) {
            const module = await import('./../commands/' + file)
            new module.default();
        }
    });
};
bootstrap();
