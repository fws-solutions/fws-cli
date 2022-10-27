import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import {resolve, extname, relative, basename, join} from 'path';
import {readdirSync, unlinkSync, lstatSync, rmdir, readFileSync, writeFileSync, existsSync} from 'fs';
import {optimize} from 'svgo';
import _template from 'lodash.template';
import _startCase from 'lodash.startcase';

export default class Icons extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('icons', 'SVG Description')
        );
    }

    run() {
        this._handleSVGFiles(resolve(this.package.getAssetsDirectory(), 'svg'));
        this._generateAdditionalFiles(resolve(this.package.getAssetsDirectory(), 'svg'));
        this._generateIconsScssFile(resolve(this.package.getAssetsDirectory(), 'svg'));
    }

    _handleSVGFiles(svgDirPath) {
        readdirSync(svgDirPath).forEach(async (file) => {
            const filePath = resolve(svgDirPath, file);

            // remove non svg files from folder
            if (extname(file) !== '.svg') {
                try {
                    if (lstatSync(filePath).isDirectory())
                        rmdir(filePath, (error) => {
                            if (error) this.inlineLogError(error);
                            this.consoleLogWarning(`Deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file!`);
                        });
                    else {
                        unlinkSync(filePath);
                        this.consoleLogWarning(`Deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file!`);
                    }
                } catch (error) {
                    this.inlineLogError(error);
                }
            } else {
                // Optimize file
                const result = optimize(readFileSync(filePath, {encoding:'utf8', flag:'r'}));

                // Rename file
                let newFilePath = filePath;
                if (file.substring(0, 4) !== 'ico-') {
                    let newFileName;
                    newFileName = file.toLowerCase();
                    newFileName = newFileName.replace('.svg', '').replace(/-/g, ' ').replace(/[^\w\s]/gi, '').replace(/[\s]+/g, '-');
                    newFileName = `ico-${newFileName}.svg`;
                    newFileName = newFileName.replace('-.svg', '.svg');
                    newFilePath = resolve(svgDirPath, newFileName);

                    if (existsSync(newFilePath)) {
                        // delete file if already exists
                        try {
                            unlinkSync(newFilePath);
                            this.consoleLogWarning(`Deleted '${newFilePath}' as file with same name already exists!`);
                        } catch (error) {
                            this.inlineLogError(error);
                        }
                    }
                    unlinkSync(filePath);
                }

                // Save file
                writeFileSync(newFilePath, result.data, {encoding:'utf8', flag:'w'});
                this.inlineLogSuccess(`Optimized ${file}`);
            }
        });
    }

    _generateAdditionalFiles(svgDirPath) {
        // set write/temp dir and src string
        let writeFile;
        let compiledImportSrc;
        let templateFile;

        if (this.isWPPackage()) {
            writeFile = resolve(this.package.getProjectRoot(), 'src/vue/components/base/SvgIcon/SvgIconGen.vue');
            compiledImportSrc = '../../../../assets/svg/<%= fileName %>.svg';
            templateFile = 'temp-svg-gen-vue-js.txt';
        } else if (this.isNuxtPackage()) {
            writeFile = resolve(this.package.getProjectRoot(), 'components/plugins/SvgIcon/SvgIconGen.vue');
            compiledImportSrc = '~/assets/svg/<%= fileName %>.svg?inline';
            templateFile = 'temp-svg-gen-vue-js.txt';
        } else if (this.isVuePackage()) {
            writeFile = resolve(this.package.getProjectRoot(), 'src/components/base/SvgIcon/SvgIconGen.vue');
            compiledImportSrc = '@/assets/svg/<%= fileName %>.svg';
            templateFile = 'temp-svg-gen-vue-ts.txt';
        }

        // set parts of lodash template
        const compiledImport = _template(`    import <%= componentName %> from '${compiledImportSrc}';\n`);
        const compiledComponent = _template('            <%= componentName %>,\n');

        let importStrings = '';
        let componentsStrings = '';

        // compile parts of lodash template
        readdirSync(svgDirPath).forEach(file => {
            const name = basename(file, '.svg');
            const componentName = _startCase(name.replace('ico-', '')).replace(/ /g, '');

            importStrings += compiledImport({
                fileName: name,
                componentName
            });

            componentsStrings += compiledComponent({
                componentName
            });
        });

        // get template file
        const svgIconGenTemp = readFileSync(resolve(this.getApplicationTemplateDirectory(), templateFile), 'utf8');
        // set full lodash template
        const compiledSvgIconGenFile = _template(svgIconGenTemp);

        // compile full lodash template
        const dataSvgIconGen = compiledSvgIconGenFile({
            imports: importStrings,
            components: componentsStrings
        });

        try {
            // generate new Vue file
            writeFileSync(writeFile, dataSvgIconGen, 'utf8');
            this.inlineLogSuccess('SvgIconGen.vue file is generated!');
        } catch (exception) {
            this.inlineLogError(exception);
        }
    }

    _generateIconsScssFile(svgDirPath) {
        // set write/temp dir
        let writeFile;
        let templateFile;

        if (this.isWPPackage()) {
            writeFile = resolve(this.package.getProjectRoot(), 'src/scss/config/_icons.scss');
            templateFile = 'temp-svg-gen-scss.txt';
        } else if (this.isNuxtPackage()) return;
          else if (this.isVuePackage())  return;

        // set parts of lodash template
        const iconsScssTemplate = readFileSync(resolve(this.getApplicationTemplateDirectory(), templateFile), 'utf8');
        const compiledIconsScssFile = _template(iconsScssTemplate);

        let scssImports = '';

        // compile parts of lodash template
        readdirSync(svgDirPath).forEach(file => {
            const name = basename(file, '.svg');
            let filePath = relative('src/scss', join(svgDirPath, file)).replace(/\\/g, '/');
            filePath = '../' + filePath.split('/src/')[1];

            scssImports += `\t@if $icon == ${name} {\n`;
            scssImports += `\t\t$path: '${filePath}'\n`;
            scssImports += '\t}\n';
        });

        // compile full lodash template
        const dataIconsScss = compiledIconsScssFile({
            imports: scssImports
        });

        try {
            // generate new scss file
            writeFileSync(writeFile, dataIconsScss, 'utf8');
            this.inlineLogSuccess('_icons.scss is generated!');
        } catch (exception) {
            this.inlineLogError(exception);
        }
    }
}
