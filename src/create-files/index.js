/**
 * Create Vue File
 *
 * @description CLI script for creating Vue components.
 */

const fs = require('fs');
const path = require('path');
const _startCase = require('lodash.startcase');
const _template = require('lodash.template');
const helpers = require('../helpers');

module.exports = {
    init: function (name, cmd) {
        const options = helpers.cleanCmdArgs(cmd);

        if (options.block) {
            module.exports.createFiles(name, 'block');
        } else if (options.part) {
            module.exports.createFiles(name, 'part');
        } else {
            helpers.consoleLogWarning('WARNING: no parameters were passed');
        }
    },

    createFiles: function (name, type) {
        const fileName = _startCase(type) + _startCase(name).replace(/ /g, '');
        const directory = path.join(process.cwd(), 'components', `${type}s`, `${fileName}.vue`);

        if (!fs.existsSync(directory)) {
            const vueComponentTempFile = path.join(helpers.moduleDir, 'templates', 'temp-vue-component.txt');
            const vueComponentTemp = fs.readFileSync(vueComponentTempFile, 'utf8');
            const compiledVueComponentTemp = _template(vueComponentTemp);
            const dataVueComponent = compiledVueComponentTemp({
                componentName: fileName,
                componentClass: name
            });

            fs.writeFileSync(directory, dataVueComponent, 'utf8');
            helpers.consoleLogWarning(`New component ${type} "${fileName}.vue" is created!`, 'cyan');
        } else {
            helpers.consoleLogWarning(`WARNING: Component ${type}: '${fileName}' already exists`);
        }
    }
};
