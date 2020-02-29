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
    init: function (name, type, starter) {
        const isStarterNuxt = starter === helpers.starterNuxt;

        const vueCompDir = isStarterNuxt ? 'components' : 'src/vue/components';
        const fileName = _startCase(type) + _startCase(name).replace(/ /g, '');
        const directory = path.join(process.cwd(), vueCompDir, `${type}s`, `${fileName}.vue`);
        const msgPrefix = isStarterNuxt ? '' : 'Vue ';

        if (!fs.existsSync(directory)) {
            const vueComponentTempFile = path.join(helpers.moduleDir, 'templates', 'temp-vue-component.txt');
            const vueComponentTemp = fs.readFileSync(vueComponentTempFile, 'utf8');
            const compiledVueComponentTemp = _template(vueComponentTemp);
            const dataVueComponent = compiledVueComponentTemp({
                componentName: fileName,
                componentClass: name
            });

            fs.writeFileSync(directory, dataVueComponent, 'utf8');
            helpers.consoleLogWarning(`New ${msgPrefix}component ${type} "${fileName}.vue" is created!`, 'cyan');
        } else {
            helpers.consoleLogWarning(`WARNING: ${msgPrefix}Component ${type}: '${fileName}' already exists`);
        }
    }
};
