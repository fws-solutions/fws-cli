/**
 * Create Vue File
 *
 * @description CLI script for creating Vue components.
 */

const helpers = require('../helpers');
const cfStarterS = require('./create-files-s');
const cfStarterNuxt = require('./create-files-nuxt');

module.exports = {
    init: function (name, cmd, starter) {
        switch (starter) {
            case 'fws_starter_nuxt':
                module.exports.checkCommand(cfStarterNuxt.init, name, cmd);
                break;
            case 'fws_starter_s':
                module.exports.checkCommand(cfStarterS.init, name, cmd);
                break;
            default:
                helpers.consoleLogWarning('This is an unknown Starter!', 'red');
        }
    },

    checkCommand: function(createFile, name, cmd) {
        const options = helpers.cleanCmdArgs(cmd);

        if (options.block) {
            createFile(name, 'block');
        } else if (options.part) {
            createFile(name, 'part');
        } else {
            helpers.consoleLogWarning('WARNING: no parameters were passed');
        }
    }
};
