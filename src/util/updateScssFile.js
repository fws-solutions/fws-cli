import { writeFileSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { getLogMessageInline } from './getLogMessageInline.js';

export const updateScssFile = (projectRoot, dirType, fileName) => {
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

    writeFileSync(file, output, 'utf8');

    getLogMessageInline(`Updated SCSS file: '${generateFile}' in dir '${directoryPath}'`, 'cyan');
};
