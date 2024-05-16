import { mkdirSync } from 'fs';
import { ROLL_BACK } from '../consts/rollBack';

export const createDirectory = (dirPath: string): void => {
    try {
        mkdirSync(dirPath);
        ROLL_BACK.directories.push(dirPath);
    } catch (exception) {
        throw exception;
    }
};
