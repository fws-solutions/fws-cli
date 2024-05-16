import { ROLL_BACK } from '../consts/rollBack';
import { getLogMessage } from './getLogMessage';
import { unlinkSync, rmdirSync } from 'fs';
import { getLogMessageInline } from './getLogMessageInline';

export const rollBack = (): void => {
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
