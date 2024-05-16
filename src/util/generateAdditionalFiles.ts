import { getSvgIconData } from './getSvgIconData';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import _startCase from 'lodash.startcase';
import _template from 'lodash.template';
import { compileSvgIcons } from './compileSvgIcons';
import { getLogMessageInline } from './getLogMessageInline';

export const generateAdditionalFiles = (
    appRoot: string,
    projectRoot: string,
    svgDirPath: string,
    packageType: string
): void => {
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
        writeFileSync(svgIconData.svgIconFile, dataSvgIconGen, 'utf8');
        getLogMessageInline('SvgIconGen.vue file is generated!', 'cyan');
    } catch (err: unknown) {
        if (err instanceof Error) {
            getLogMessageInline(err.message, 'red');
        }
    }
};
