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
    starter: '',

    init: function(starter) {
        this.starter = starter;
        const svgDirPath = path.join(process.cwd(), `${this.starter !== helpers.starterNuxt ? 'src/' : ''}assets/svg`);

        this.handleSvgFiles(svgDirPath);
        this.generateFiles(svgDirPath);
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

    generateFiles: function(svgDirPath) {
        const _this = this;

        Promise.all(this.optimizeSVGs)
            .then(() => {
                let msg = 'SVGs are optimized and SvgIconGen.vue file is generated!';
                _this.generateSvgIcon(svgDirPath);

                if (this.starter !== helpers.starterS) {
                    _this.generateSvgJson(svgDirPath);
                    msg += '\n    And svgIconList.json for stories is generated!';
                } else {
                    _this.generateSvgScssVars(svgDirPath);
                    msg += '\n    And SCSS _icons.scss is generated!';
                }

                helpers.consoleLogWarning(msg, 'cyan');
            })
            .catch(error => {
                fancyLog(colors.red(error));
            });
    },

    loopFiles: function(svgDirPath, callback) {
        fs.readdirSync(svgDirPath).forEach(file => {
            const name = path.basename(file, '.svg');
            const relPath = path.relative('src/scss', path.join(svgDirPath, file)).replace(/\\/g, '/');
            
            const svg = {
                name,
                relPath
            };

            callback(svg);
        });
    },

    generateSvgJson: function(svgDirPath) {
        let icons = [];

        // set new array of icons
        this.loopFiles(svgDirPath, function(svg) {
            const componentName = _startCase(svg.name.replace('ico-', '')).replace(/ /g, '');

            icons.push({
                fileName: svg.name,
                componentName
            });
        });

        // convert to JSON format
        icons = JSON.stringify(icons, null, '\t');

        // generate new JSON file
        fs.writeFileSync(`${this.starter !== helpers.starterNuxt ? 'src/' : ''}stories/base/svgIconList.json`, icons, 'utf8');
    },

    generateSvgScssVars: function(svgDirPath) {
        // get template file
        const svgScssGenTempFile = path.join(helpers.moduleDir, 'templates', 'temp-svg-gen-scss.txt');
        const svgScssGenTemp = fs.readFileSync(svgScssGenTempFile, 'utf8');

        // set full lodash template
        const compiledSvgScssGenFile = _template(svgScssGenTemp);

        // compile parts of lodash template
        let scssImports = '';

        // set scss imports
        this.loopFiles(svgDirPath, function(svg) {
            scssImports += `\t@if $icon == ${svg.name} {\n`;
            scssImports += `\t\t$path: '${svg.relPath}'\n`;
            scssImports += '\t}\n';
        });

        // compile full lodash template
        const dataSvgScssGen = compiledSvgScssGenFile({
            imports: scssImports
        });

        // generate new Vue file
        fs.writeFileSync('src/scss/config/_icons.scss', dataSvgScssGen, 'utf8');
    },

    generateSvgIcon: function(svgDirPath) {
        // set write/temp dir and src string
        let writeDir;
        let compiledImportSrc;
        let tempFile;

        switch (this.starter) {
            case helpers.starterS:
                writeDir = 'src/vue/components/base/SvgIcon/SvgIconGen.vue';
                compiledImportSrc = '../../../../assets/svg/<%= fileName %>.svg';
                tempFile = 'temp-svg-gen-vue-js.txt';
                break;
            case helpers.starterNuxt:
                writeDir = 'components/plugins/SvgIcon/SvgIconGen.vue';
                compiledImportSrc = '~/assets/svg/<%= fileName %>.svg?inline';
                tempFile = 'temp-svg-gen-vue-js.txt';
                break;
            case helpers.starterVue:
                writeDir = 'src/components/base/SvgIcon/SvgIconGen.vue';
                compiledImportSrc = '@/assets/svg/<%= fileName %>.svg';
                tempFile = 'temp-svg-gen-vue-ts.txt';
                break;
        }

        // get template file
        const svgIconGenTempFile = path.join(helpers.moduleDir, 'templates', tempFile);
        const svgIconGenTemp = fs.readFileSync(svgIconGenTempFile, 'utf8');

        // set parts of lodash template
        const compiledImport = _template(`    import <%= componentName %> from '${compiledImportSrc}';\n`);
        const compiledComponent = _template('            <%= componentName %>,\n');

        // set full lodash template
        const compiledSvgIconGenFile = _template(svgIconGenTemp);

        let importStrings = '';
        let componentsStrings = '';

        // compile parts of lodash template
        this.loopFiles(svgDirPath, function(svg) {
            const componentName = _startCase(svg.name.replace('ico-', '')).replace(/ /g, '');

            importStrings += compiledImport({
                fileName: svg.name,
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
