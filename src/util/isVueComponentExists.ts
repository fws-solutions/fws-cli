import { getLogMessage } from './getLogMessage';
import { existsSync } from 'fs';
import _startCase from 'lodash.startcase';

export const isVueComponentExist = (filePath: string, fileName: string): void => {
    if (existsSync(filePath)) {
        getLogMessage(`WARNING: Component '${fileName}' already exists!`, 'yellow');
        process.exit(1);
    }
};
