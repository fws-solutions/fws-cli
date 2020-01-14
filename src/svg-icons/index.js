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
    svgDirPath: path.join(process.cwd(), 'assets', 'svg'),
    optimizeSVGs: [],

    init: function (starter) {
        this.handleSvgFiles();
        this.generateVueFile(starter);
    },

    handleSvgFiles: function () {
        fs.readdirSync(this.svgDirPath).forEach((file, i, allFiles) => {
            const filePath = path.join(this.svgDirPath, file);

            // remove non svg files from folder
            if (path.extname(file) !== '.svg') {
                try {
                    fs.unlinkSync(filePath);
                    helpers.consoleLogWarning(`deleted '${path.relative(this.svgDirPath, filePath)}' as it is not an SVG file`, 'red');
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
                        return SHF.renameSvgFiles(file, filePath, allFiles, this.svgDirPath);
                    });

                // store all optimization Promise functions
                this.optimizeSVGs.push(optimizeSVG);
            }
        });
    },

    generateVueFile: function (starter) {
        Promise.all(this.optimizeSVGs)
            .then(() => {
                const svgIconGenTempFile = path.join(helpers.moduleDir, 'templates', `temp-svg-gen-${starter}.txt`);
                const svgIconGenTemp = fs.readFileSync(svgIconGenTempFile, 'utf8');
                let importStrings = '';
                let componentsStrings = '';

                const compiledImport = _template('    import <%= componentName %> from \'~/assets/svg/<%= fileName %>.svg?inline\';\n');
                const compiledComponent = _template('            <%= componentName %>,\n');
                const compiledSvgIconGenFile = _template(svgIconGenTemp);

                fs.readdirSync(this.svgDirPath).forEach(file => {
                    const fileName = path.basename(file, '.svg');
                    const componentName = _startCase(fileName.replace('ico-', '')).replace(' ', '');

                    importStrings += compiledImport({
                        fileName,
                        componentName
                    });

                    componentsStrings += compiledComponent({
                        componentName
                    });
                });

                const dataSvgIconGen = compiledSvgIconGenFile({
                    imports: importStrings,
                    components: componentsStrings
                });

                fs.writeFileSync('components/plugins/SvgIcon/SvgIconGen.vue', dataSvgIconGen, 'utf8');
                helpers.consoleLogWarning('SVGs are optimized and SvgIconGen.vue file is generated!', 'cyan');
            })
            .catch(error => {
                fancyLog(colors.red(error));
            });
    }
};
