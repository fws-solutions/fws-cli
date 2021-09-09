/**
 * File Structure
 *
 * @description CLI script for checking if the file importedDefinedStructure in specific project is according to a defined standard.
 */
const fs = require('fs');
const path = require('path');
const colors = require('ansi-colors');
const helpers = require('../helpers');
const store = require('../store');
const yaml = require('yaml');

const FileStructure = {
    importedDefinedStructure: {
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
    definedStructure: [],
    projectStructure: [],
    componentsRootPath: '',
    structureOK: true,

    init: function() {
        // this.definedStructure = this.importedDefinedStructure.componentsRootStructure;
        // this.componentsRootPath = path.join(store.getters.getProjectRoot(), this.importedDefinedStructure.componentsRootDirectory);
        //
        // this.checkStructure();
        //
        // if (this.structureOK) {
        //     console.log(colors.cyan('Components file structure matches. :)'));
        // }

        console.log(store.data);
    },

    getStructureConfig: function() {
        if (!this.hostName) {
            const hostName = fs.readFileSync(this.landoConfigDir, 'utf8');
            this.hostName = yaml.parse(hostName)['proxy']['appserver'][0];
        }
    },

    checkStructure: function() {
        const compRootDir = fs.readdirSync(this.componentsRootPath);
        this.projectStructure = compRootDir.filter(value => {
            return !this.importedDefinedStructure.ignoreFiles.includes(value);
        });

        this.checkStructureSizes();
        this.checkStructureNames();
    },

    checkStructureSizes: function() {
        // exit if everything matches
        if (this.projectStructure.length === this.definedStructure.length) {
            return null;
        }

        this.structureNotOk();

        // log lists of directories
        const projectStructureSize = this.projectStructure.length > this.definedStructure.length ? 'bigger' : 'smaller';
        let report = colors.yellow(`Project structure is ${colors.red(projectStructureSize)} than defined structure.\n`);
        report += this.logReportFolderStructure('Defined structure:', this.definedStructure);
        report += this.logReportFolderStructure('Project structure:', this.projectStructure);

        helpers.consoleLogReport('NUMBER OF DIRs DON\'T MATCH', report);
    },

    checkStructureNames: function() {
        const mismatched = this.projectStructure.filter(value => {
            return !this.definedStructure.includes(value);
        });

        // exit if everything matches
        if (mismatched.length === 0) {
            return null;
        }

        this.structureNotOk();

        // log mismatched directories
        let report = colors.yellow(`These directories are ${colors.red('not')} from defined structure:\n`);
        report += this.logReportFolderStructure('Mismatched directories:', mismatched);

        helpers.consoleLogReport('MISMATCHED STRUCTURE', report);

        return true;
    },

    logReportFolderStructure: function(title, structureList) {
        let report = colors.white(`\n\t${title}\n`);
        report += colors.grey('\t  -');
        report += colors.grey(structureList.join('\n\t  -'));
        report += '\n';

        return report;
    },

    structureNotOk: function() {
        this.structureOK = false;
    }
};

module.exports = FileStructure;
