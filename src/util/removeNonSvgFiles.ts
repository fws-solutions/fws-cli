import { lstatSync, unlinkSync, rmdir } from 'fs';
import { relative } from 'path';
import _startCase from 'lodash.startcase';
import _template from 'lodash.template';
import { getLogMessageInline } from './getLogMessageInline';

export const removeNonSvgFiles = (filePath: string, svgDirPath: string): void => {
    try {
        if (lstatSync(filePath).isDirectory())
            rmdir(filePath, (error) => {
                if (error) console.log(error);
                else
                    getLogMessageInline(
                        `Deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file!`,
                        'yellow'
                    );
            });
        else {
            unlinkSync(filePath);
            getLogMessageInline(`Deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file!`, 'yellow');
        }
    } catch (error) {
        console.log(error);
    }
};
