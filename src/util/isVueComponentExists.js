import { getLogMessage } from './getLogMessage.js';
import { existsSync } from 'fs';

export const isVueComponentExist = (filePath, fileName) => {
    if (existsSync(filePath)) {
        getLogMessage(`WARNING: Component '${fileName}' already exists!`, 'yellow');
        throw new Error('Component already exists!');
    }
};
