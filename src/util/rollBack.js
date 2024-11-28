import { ROLL_BACK } from '../consts/rollBack.js';
import { getLogMessage } from './getLogMessage.js';
import { unlinkSync, rmdirSync } from 'fs';
import { getLogMessageInline } from './getLogMessageInline.js';

export const rollBack = () => {
    getLogMessage(`Something went wrong...`, 'red');
    ROLL_BACK.files.forEach((file) => {
        unlinkSync(file);
        getLogMessageInline(`Deleted ${file} file!`, 'yellow');
    });
    ROLL_BACK.directories.forEach((directory) => {
        rmdirSync(directory);
        getLogMessageInline(`Deleted ${directory} directory!`, 'yellow');
    });
};
