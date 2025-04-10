import { writeFile } from 'fs/promises';
import { compileTemplate } from './compileTemplate.js';
import { ROLL_BACK } from '../consts/rollBack.js';
import _startCase from 'lodash.startcase';
import { getLogMessageInline } from './getLogMessageInline.js';

export const createLandoYmlFile = (dirPath, projectName, phpVersion, themeName, template, packageMetadata) => {
    const data = {
        projectName: _startCase(projectName).replace(/[\s]+/g, '-').toLowerCase(),
        phpVersion: phpVersion,
        themeName: themeName,
    };
    const output = compileTemplate(template, data, packageMetadata);

    writeFile(dirPath, output, 'utf8').catch((exception) => {
        ROLL_BACK.files.push(dirPath);
        throw exception;
    });

    getLogMessageInline(`Lando.yml file created in the root directory`, 'cyan');
};
