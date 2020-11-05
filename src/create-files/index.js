/**
 * Create File
 *
 * @description CLI script for creating components.
 */

const helpers = require('../helpers');
const store = require('../store');
const cfTempView = require('./create-files-temp-view');
const cfVue = require('./create-files-vue');

module.exports = {
    starter: '',

    init: function(name, cmd) {
        this.starter = store.getters.getStarter();

        let option = helpers.cleanCmdArgs(cmd);
        option = Object.keys(option)[0];

        if (option) {
            module.exports.checkStarter(name, option);
        } else {
            helpers.consoleLogWarning('WARNING: no parameters were passed');
        }
    },

    checkStarter(name, option) {
        if (this.starter === helpers.starterS || this.starter === helpers.starterTwig) {
            const isVue = option.includes('Vue');
            const cf = isVue ? cfVue : cfTempView;
            const opt = isVue ? option.replace('Vue', '') : option;

            cf.init(name, opt, this.starter);
        } else if (this.starter === helpers.starterVue || this.starter === helpers.starterNuxt) {
            cfVue.init(name, option, this.starter);
        } else {
            helpers.consoleLogWarning('This is an unknown Starter!', 'red');
        }
    }
};
