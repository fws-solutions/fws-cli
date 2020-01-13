#!/usr/bin/env node
const npm = require('npm');
const commander = require('commander');
const path = require('path');
const program = new commander.Command();

program.version('0.0.1');

program
  .command('fws-test <name>')
  .action(function(name) {
  	console.log(name)

	npm.load(() => {
	  npm.run('test');
	});
  })


program.parse(process.argv);
