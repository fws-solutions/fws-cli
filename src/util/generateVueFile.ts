import { writeFileSync } from 'fs';
import { compileTemplate } from './compileTemplate';
import { ROLL_BACK } from '../consts/rollBack';
import { getLogMessageInline } from './getLogMessageInline';
import { getVueComponentTemplate } from './getVueComponentTemplate';

export const generateVueFile = (
    packageType: string,
    componentName: string,
    fileName: string,
    filePath: string
): void => {
    const templateFile = getVueComponentTemplate(packageType);
    const data = {
        componentName: componentName,
        componentClass: fileName,
    };

    const compiledTemplate = compileTemplate(templateFile, data);

    try {
        writeFileSync(filePath, compiledTemplate, 'utf8');
        ROLL_BACK.files.push(filePath);
    } catch (exception) {
        throw exception;
    }

    getLogMessageInline(`New component "${componentName}.vue" is created!`, 'cyan');
};
