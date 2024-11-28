import { lstat, unlink, rmdir } from 'fs/promises';
import { relative } from 'path';
import { getLogMessageInline } from './getLogMessageInline.js';

export const removeNonSvgFiles = (filePath, svgDirPath) => {
    try {
        if (lstat(filePath).isDirectory())
            rmdir(filePath, (error) => {
                if (error) console.log(error);
                else
                    getLogMessageInline(
                        `Deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file!`,
                        'yellow'
                    );
            });
        else {
            unlink(filePath);
            getLogMessageInline(`Deleted '${relative(svgDirPath, filePath)}' as it is not an SVG file!`, 'yellow');
        }
    } catch (error) {
        console.log(error);
    }
};
