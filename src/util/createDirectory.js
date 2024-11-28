import { mkdirSync } from 'fs';
import { ROLL_BACK } from '../consts/rollBack.js';

export const createDirectory = (dirPath) => {
    mkdirSync(dirPath);
    ROLL_BACK.directories.push(dirPath);
};
