/**
 * SVG Icons
 *
 * @description Run scripts for handling and creating SVG icons.
 */

const fs = require('fs');
const path = require('path');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const _template = require('lodash.template');
const _startCase = require('lodash.startcase');
const helpers = require('../helpers');
const SHF = require('./svg-handle-files');

module.exports = {
    optimizeSVGs: [],

    init: function(starter) {
        const svgDirPath = path.join(process.cwd(), `${starter === 'fws_starter_s' ? 'src/' : ''}assets/svg`);

        this.handleSvgFiles(svgDirPath);
        this.generateFiles(svgDirPath, starter);
    },

    handleSvgFiles: function(svgDirPath) {
        fs.readdirSync(svgDirPath).forEach((file, i, allFiles) => {
            const filePath = path.join(svgDirPath, file);

            // remove non svg files from folder
            if (path.extname(file) !== '.svg') {
                try {
                    fs.unlinkSync(filePath);
                    helpers.consoleLogWarning(`deleted '${path.relative(svgDirPath, filePath)}' as it is not an SVG file`, 'red');
                } catch (err) {
                    fancyLog(colors.red(err));
                }
            } else {
                // svgo optimization
                const optimizeSVG = SHF.optimizeSvgFiles(filePath)
                    .then(result => {
                        // save optimized file
                        return SHF.saveSvgFiles(filePath, result.data);
                    })
                    .then(() => {
                        // clean file name and prefix it
                        return SHF.renameSvgFiles(file, filePath, allFiles, svgDirPath);
                    });

                // store all optimization Promise functions
                this.optimizeSVGs.push(optimizeSVG);
            }
        });
    },

    generateFiles: function(svgDirPath, starter) {
        const _this = this;

        Promise.all(this.optimizeSVGs)
            .then(() => {
                let msg = 'SVGs are optimized and SvgIconGen.vue file is generated!';
                _this.generateSvgIcon(svgDirPath, starter);

                if (starter === 'fws_starter_nuxt') {
                    _this.generateSvgJson(svgDirPath);
                    msg += '\n    And svgIconList.json for stories is generated!';
                }

                helpers.consoleLogWarning(msg, 'cyan');
            })
            .catch(error => {
                fancyLog(colors.red(error));
            });
    },

    loopFileNames: function(svgDirPath, callback) {
        fs.readdirSync(svgDirPath).forEach(file => {
            const fileName = path.basename(file, '.svg');

            callback(fileName);
        });
    },

    generateSvgJson: function(svgDirPath) {
        const icons = [];

        // set new array of icons
        this.loopFileNames(svgDirPath, function(fileName) {
            const componentName = _startCase(fileName.replace('ico-', '')).replace(/ /g, '');

            icons.push({
                fileName,
                componentName
            });
        });

        // generate new JSON file
        fs.writeFileSync('stories/elements/svgIconList.json', JSON.stringify(icons, null, '\t'), 'utf8');
    },

    generateSvgIcon: function(svgDirPath, starter) {
        // set write dir
        const writeDir = starter === 'fws_starter_s' ? 'src/vue/components/base/SvgIcon/SvgIconGen.vue' : 'components/plugins/SvgIcon/SvgIconGen.vue';
        // get template file
        const svgIconGenTempFile = path.join(helpers.moduleDir, 'templates', 'temp-svg-gen.txt');
        const svgIconGenTemp = fs.readFileSync(svgIconGenTempFile, 'utf8');
        // set import src string
        const compiledImportSrc = starter === 'fws_starter_s' ? '../../../../assets/svg/<%= fileName %>.svg' : '~/assets/svg/<%= fileName %>.svg?inline';
        // set parts of lodash template
        const compiledImport = _template(`    import <%= componentName %> from '${compiledImportSrc}';\n`);
        const compiledComponent = _template('            <%= componentName %>,\n');
        // set full lodash template
        const compiledSvgIconGenFile = _template(svgIconGenTemp);

        let importStrings = '';
        let componentsStrings = '';

        // compile parts of lodash template
        this.loopFileNames(svgDirPath, function(fileName) {
            const componentName = _startCase(fileName.replace('ico-', '')).replace(/ /g, '');

            importStrings += compiledImport({
                fileName,
                componentName
            });

            componentsStrings += compiledComponent({
                componentName
            });
        });

        // compile full lodash template
        const dataSvgIconGen = compiledSvgIconGenFile({
            imports: importStrings,
            components: componentsStrings
        });

        // generate new Vue file
        fs.writeFileSync(writeDir, dataSvgIconGen, 'utf8');
    }
};
