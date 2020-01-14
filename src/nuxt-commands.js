/**
 * Nuxt CLI
 *
 * @description Define CLI commands for Nuxt Headless Starter.
 */

const npm = require('npm');

module.exports = {
    mapCommand: function (program, script) {
        program
            .command(script)
            .description('runs nuxt ' + script + ' script')
            .action(function () {
                module.exports.runTask(script);
            });
    },
    runTask: function (task) {
        npm.load(() => {
            npm.run(task);
        });
    }
};
