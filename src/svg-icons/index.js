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

    init: function (starter) {
        const svgDirPath = path.join(process.cwd(), `${starter === 'fws_starter_s' ? 'src/' : ''}assets/svg`);

        this.handleSvgFiles(svgDirPath);
        this.generateVueFile(svgDirPath, starter);
    },

    handleSvgFiles: function (svgDirPath) {
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

    generateVueFile: function (svgDirPath, starter) {
        Promise.all(this.optimizeSVGs)
            .then(() => {
                const svgIconGenTempFile = path.join(helpers.moduleDir, 'templates', 'temp-svg-gen.txt');
                const svgIconGenTemp = fs.readFileSync(svgIconGenTempFile, 'utf8');
                let importStrings = '';
                let componentsStrings = '';

                const compiledImportSrc = starter === 'fws_starter_s' ? '../../../../assets/svg/<%= fileName %>.svg' : '~/assets/svg/<%= fileName %>.svg?inline';

                const compiledImport = _template(`    import <%= componentName %> from '${compiledImportSrc}';\n`);
                const compiledComponent = _template('            <%= componentName %>,\n');
                const compiledSvgIconGenFile = _template(svgIconGenTemp);

                fs.readdirSync(svgDirPath).forEach(file => {
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

                const writeDir = starter === 'fws_starter_s' ? 'src/vue/components/parts/SvgIcon/SvgIconGen.vue' : 'components/plugins/SvgIcon/SvgIconGen.vue';

                fs.writeFileSync(writeDir, dataSvgIconGen, 'utf8');
                helpers.consoleLogWarning('SVGs are optimized and SvgIconGen.vue file is generated!', 'cyan');
            })
            .catch(error => {
                fancyLog(colors.red(error));
            });
    }
};
