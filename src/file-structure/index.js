/**
 * File Structure
 *
 * @description CLI script for checking if the file structure in specific project is according to a defined standard.
 */
const fs = require('fs');
const path = require('path');
const colors = require('ansi-colors');
const helpers = require('../helpers');
const store = require('../store');

const FileStructure = {
    structure: {
        componentsRootDirectory: 'template-views',
        componentsRootStructure: [
            'blocks',
            'listings',
            'parts',
            'shared'
        ],
        ignoreFiles: [
            '.DS_Store'
        ]
    },
    componentsRootPath: '',

    init: function() {
        this.componentsRootPath = path.join(store.getters.getProjectRoot(), this.structure.componentsRootDirectory);

        this.test();
    },

    test: function() {
        var components = fs.readdirSync(this.componentsRootPath);

        var filtered = components.filter((value, index, arr) => {
            return !this.structure.ignoreFiles.includes(value);
        });

        console.log(filtered);
    }
};

module.exports = FileStructure;
