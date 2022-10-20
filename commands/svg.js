import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import {resolve, extname, relative, basename} from 'path';
import {readdirSync, unlinkSync, lstatSync, rmdir, readFileSync, writeFileSync, existsSync} from 'fs';
import {optimize} from 'svgo';
import _template from 'lodash.template';
import _startCase from 'lodash.startcase';

export default class Svg extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('svg', 'SVG Description')
                .setMandatoryParameters('mandatory1', 'mandatory2')
                .setOptionalParameters('optional1')
        );
    }

    run(mandatory1, mandatory2, optional1) {
        this._handleSVGFiles(resolve(this.package.getAssetsDirectory(), 'svg'));
        this._generateAdditionalFiles(resolve(this.package.getAssetsDirectory(), 'svg'));
    }

    _handleSVGFiles(svgDirPath) {
        readdirSync(svgDirPath).forEach(async (file, i, allFiles) => {
            const filePath = resolve(svgDirPath, file);

            // remove non svg files from folder
            if (extname(file) !== '.svg') {
                try {
                    if (lstatSync(filePath).isDirectory())
                        rmdir(filePath, (error) => {
                            if (error) this.consoleLogError(error);
                            this.consoleLogWarning(`deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file`, 'red');
                        });
                    else {
                        unlinkSync(filePath);
                        this.consoleLogWarning(`deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file`, 'red');
                    }
                } catch (error) {
                    this.consoleLogError(error);
                }
            } else {
                console.log(`We should optimize ${file}`);
                // Optimize file
                const result = optimize(readFileSync(filePath, {encoding:'utf8', flag:'r'}));

                // Rename file
                let newFilePath = filePath;
                if (file.substring(0, 4) !== 'ico-') {
                    let newFileName;
                    newFileName = file.toLowerCase();
                    newFileName = newFileName.replace('.svg', '').replace(/-/g, ' ').replace(/[^\w\s]/gi, '').replace(/ /g, '-');
                    newFileName = `ico-${newFileName}.svg`;
                    newFilePath = resolve(svgDirPath, newFileName);

                    if (existsSync(newFilePath)) {
                        // delete file if already exists
                        try {
                            unlinkSync(newFilePath);
                            this.consoleLogWarning(`deleted '${newFilePath}' as file with same name already exists`, 'red');
                        } catch (error) {
                            this.consoleLogError(error);
                        }
                    }
                    unlinkSync(filePath);
                }

                // Save file
                writeFileSync(newFilePath, result.data, {encoding:'utf8', flag:'w'});
            }
        });
    }

    _generateAdditionalFiles(svgDirPath) {
        // set write/temp dir and src string
        let writeDir;
        let compiledImportSrc;
        let tempFile;

        if (this.isWPPackage()) {
            writeDir = resolve(this.package.getProjectRoot(), 'src/vue/components/base/SvgIcon/SvgIconGen.vue');
            compiledImportSrc = '../../../../assets/svg/<%= fileName %>.svg';
            tempFile = 'temp-svg-gen-vue-js.txt';
        } else if (this.isNuxtPackage()) {
            writeDir = resolve(this.package.getProjectRoot(), 'components/plugins/SvgIcon/SvgIconGen.vue');
            compiledImportSrc = '~/assets/svg/<%= fileName %>.svg?inline';
            tempFile = 'temp-svg-gen-vue-js.txt';
        } else if (this.isVuePackage()) {
            writeDir = resolve(this.package.getProjectRoot(), 'src/components/base/SvgIcon/SvgIconGen.vue');
            compiledImportSrc = '@/assets/svg/<%= fileName %>.svg';
            tempFile = 'temp-svg-gen-vue-ts.txt';
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
        const svgIconGenTemp = readFileSync(resolve(this.getApplicationTemplateDirectory(), tempFile), 'utf8');
        // set full lodash template
        const compiledSvgIconGenFile = _template(svgIconGenTemp);

        // compile full lodash template
        const dataSvgIconGen = compiledSvgIconGenFile({
            imports: importStrings,
            components: componentsStrings
        });

        // generate new Vue file
        writeFileSync(writeDir, dataSvgIconGen, 'utf8');
    }
}
