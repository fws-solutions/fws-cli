import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import _template from 'lodash.template';
import { getLogMessageInline } from './getLogMessageInline.js';
import { prepareIconsScssFile } from './prepareIconsScssFile.js';

export const generateIconsScssFile = (projectRoot, appRoot, svgDirPath) => {
    const writeFile = resolve(projectRoot, 'src/scss/config/_icons.scss');
    const iconsScssTemplate = readFileSync(resolve(appRoot, 'src/templates/other/temp-svg-gen-scss.txt'), 'utf8');
    const compiledIconsScssFile = _template(iconsScssTemplate);
    const scssImports = prepareIconsScssFile(svgDirPath);

    const dataIconsScss = compiledIconsScssFile({
        imports: scssImports,
    });

    try {
        writeFileSync(writeFile, dataIconsScss, 'utf8');
    } catch (exception) {
        console.log(exception);
    }

    getLogMessageInline('_icons.scss is generated!', 'cyan');
};
