import { writeFileSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { getLogMessageInline } from './getLogMessageInline';
import _template from 'lodash.template';

export const updateScssFile = (projectRoot: string, dirType: string, fileName: string): void => {
    let output = '';
    const directoryPath = 'src/scss/layout';
    const directory = 'template-views';
    const generateFile = `_${dirType}s.scss`;
    const file = resolve(projectRoot, directoryPath, generateFile);

    if (existsSync(file)) {
        output = readFileSync(file, 'utf8');
    }

    output = output.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
    output += `\n@import '../../../${directory}/${dirType}s/${fileName}/${fileName}';`;

    try {
        writeFileSync(file, output, 'utf8');
    } catch (exception) {
        throw exception;
    }

    getLogMessageInline(`Updated SCSS file: '${generateFile}' in dir '${directoryPath}'`, 'cyan');
};
