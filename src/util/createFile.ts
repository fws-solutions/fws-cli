import { writeFileSync } from 'fs';
import { getLogMessageInline } from './getLogMessageInline';
import { compileTemplate } from './compileTemplate';
import { resolve } from 'path';
import { ROLL_BACK } from '../consts/rollBack';

export const createFile = (
    dirName: string,
    dirType: string,
    tempName: string,
    prefix: string,
    extension: string,
    dirPath: string
): void => {
    const template = `temp-${dirType}-${tempName}.txt`;
    const fileName = `${prefix + dirName}.${extension}`;
    const writeDir = resolve(dirPath, fileName);

    const data = {
        str: dirName,
    };
    const output = compileTemplate(template, data);

    try {
        writeFileSync(writeDir, output, 'utf8');
        ROLL_BACK.files.push(writeDir);
    } catch (exception) {
        throw exception;
    }

    getLogMessageInline(
        `Created ${extension.toUpperCase()} file: '${fileName}' in dir template-views/${dirType}s/${dirName}'`,
        'cyan'
    );
};
