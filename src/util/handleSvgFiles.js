import { readdirSync } from 'fs';
import { handleSvgFile } from './handleSvgFile.js';

export const handleSvgFiles = (svgDirPath) => {
    readdirSync(svgDirPath).forEach(async (file) => {
        handleSvgFile(svgDirPath, file);
    });
};
