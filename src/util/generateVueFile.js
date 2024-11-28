import { writeFile } from 'fs/promises';
import { compileTemplate } from './compileTemplate.js';
import { ROLL_BACK } from '../consts/rollBack.js';
import { getLogMessageInline } from './getLogMessageInline.js';
import { getVueComponentTemplate } from './getVueComponentTemplate.js';

export const generateVueFile = (packageType, componentName, fileName, filePath) => {
    const templateFile = getVueComponentTemplate(packageType);
    const data = {
        componentName: componentName,
        componentClass: fileName,
    };

    const compiledTemplate = compileTemplate(templateFile, data);

    writeFile(filePath, compiledTemplate, 'utf8').catch((exception) => {
        ROLL_BACK.files.push(filePath);
        throw exception;
    });

    getLogMessageInline(`New component "${componentName}.vue" is created!`, 'cyan');
};
