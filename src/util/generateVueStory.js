import { writeFile } from 'fs/promises';
import { compileTemplate } from './compileTemplate.js';
import { ROLL_BACK } from '../consts/rollBack.js';
import { getLogMessageInline } from './getLogMessageInline.js';
import { resolve } from 'path';
import { getVueStoryTempAndDir } from './getVueStoryTempAndDir.js';
import _startCase from 'lodash.startcase';

export const generateVueStory = (packageMetadata, componentName, dirType, fileName) => {
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

    writeFile(filePath, compiledTemplate, 'utf8').catch((err) => {
        ROLL_BACK.files.push(filePath);
        throw err;
    });

    getLogMessageInline(`New story ${dirType} "${prefix}${componentName}.stories.js" is created!`, 'cyan');
};
