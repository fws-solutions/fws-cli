import { writeFile } from 'fs/promises';
import { getLogMessageInline } from './getLogMessageInline.js';
import { compileTemplate } from './compileTemplate.js';
import { resolve } from 'path';
import { ROLL_BACK } from '../consts/rollBack.js';

export const createFile = (dirName, dirType, tempName, prefix, extension, dirPath) => {
    const template = `temp-${dirType}-${tempName}.txt`;
    const fileName = `${prefix + dirName}.${extension}`;
    const writeDir = resolve(dirPath, fileName);

    const data = {
        str: dirName,
    };
    const output = compileTemplate(template, data);

    writeFile(writeDir, output, 'utf8').catch((exception) => {
        ROLL_BACK.files.push(writeDir);
        throw exception;
    });

    getLogMessageInline(
        `Created ${extension.toUpperCase()} file: '${fileName}' in dir template-views/${dirType}s/${dirName}'`,
        'cyan'
    );
};
