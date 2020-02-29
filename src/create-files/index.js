/**
 * Create Vue File
 *
 * @description CLI script for creating Vue components.
 */

const helpers = require('../helpers');
const cfTempView = require('./create-files-temp-view');
const cfVue = require('./create-files-vue');

module.exports = {
    init: function (name, cmd, starter) {
        let option = helpers.cleanCmdArgs(cmd);
        option = Object.keys(option)[0];

        if (option) {
            module.exports.checkStarter(name, option, starter);
        } else {
            helpers.consoleLogWarning('WARNING: no parameters were passed');
        }
    },

    checkStarter(name, option, starter) {
        switch (starter) {
            case helpers.starterNuxt:
                cfVue.init(name, option, helpers.starterNuxt);
                break;
            case helpers.starterS:
                const isVue = option.includes('Vue');
                const cf = isVue ? cfVue : cfTempView;
                const opt = isVue ? option.replace('Vue', '') : option;

                cf.init(name, opt, helpers.starterS);
                break;
            default:
                helpers.consoleLogWarning('This is an unknown Starter!', 'red');
        }
    }
};
