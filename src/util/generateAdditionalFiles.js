import { getSvgIconData } from './getSvgIconData.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import _template from 'lodash.template';
import { compileSvgIcons } from './compileSvgIcons.js';
import { getLogMessageInline } from './getLogMessageInline.js';

export const generateAdditionalFiles = (appRoot, projectRoot, svgDirPath, packageType) => {
    const svgIconData = getSvgIconData(projectRoot, packageType);
    const compiledImportSrc = svgIconData.compiledImportSrc;
    const compiledSvgIcons = compileSvgIcons(compiledImportSrc, svgDirPath);
    const svgIconGenTemp = readFileSync(resolve(appRoot, 'src/templates/other', svgIconData.templateFile), 'utf8');
    const compiledSvgIconGenFile = _template(svgIconGenTemp);

    const dataSvgIconGen = compiledSvgIconGenFile({
        imports: compiledSvgIcons.impStrings,
        components: compiledSvgIcons.compStrings,
    });

    try {
        if (existsSync(svgIconData.dir)) {
            writeFileSync(svgIconData.svgIconFile, dataSvgIconGen, 'utf8');
            getLogMessageInline('SvgIconGen.vue file is generated!', 'cyan');
        }
    } catch (err) {
        if (err instanceof Error) {
            getLogMessageInline(err.message, 'red');
        }
    }
};
