import { existsSync } from 'fs';
import { getLogMessage } from './getLogMessage.js';

export const validateDirectory = (dirPath, errorMsg) => {
    if (existsSync(dirPath)) {
        getLogMessage(errorMsg, 'red');
        throw new Error('Directory already exists!');
    }
};
