import { readdirSync } from 'fs';
import _startCase from 'lodash.startcase';
import _template from 'lodash.template';
import { handleSvgFile } from './handleSvgFile';

export const handleSvgFiles = (svgDirPath: string): void => {
    readdirSync(svgDirPath).forEach(async (file) => {
        handleSvgFile(svgDirPath, file);
    });
};
