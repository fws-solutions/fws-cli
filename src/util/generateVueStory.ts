import { writeFileSync } from 'fs';
import { compileTemplate } from './compileTemplate';
import { ROLL_BACK } from '../consts/rollBack';
import { getLogMessageInline } from './getLogMessageInline';
import { resolve } from 'path';
import { getVueStoryTempAndDir } from './getVueStoryTempAndDir';
import { IPackageMetadata } from '../interfaces/interfaces';
import _startCase from 'lodash.startcase';

export const generateVueStory = (
    packageMetadata: IPackageMetadata,
    componentName: string,
    dirType: string,
    fileName: string
): void => {
    const vueStoryTempAndDir = getVueStoryTempAndDir(packageMetadata.packageType);
    const prefix = dirType === 'part' ? '2-' : '3-';
    const filePath = resolve(
        packageMetadata.projectRoot,
        vueStoryTempAndDir.dir + `/${prefix + componentName}.stories.js`
    );

    const data = {
        componentSrc: `../components/${dirType}s/${componentName}`,
        componentName: componentName,
        componentPrettyName: _startCase(fileName),
        componentPrettyNamePrefix: _startCase(dirType) + ': ',
        componentWrapFluid: true,
    };
    const compiledTemplate = compileTemplate(vueStoryTempAndDir.temp, data);

    try {
        writeFileSync(filePath, compiledTemplate, 'utf8');
        ROLL_BACK.files.push(filePath);
    } catch (exception) {
        throw exception;
    }

    getLogMessageInline(`New story ${dirType} "${prefix}${componentName}.stories.js" is created!`, 'cyan');
};
