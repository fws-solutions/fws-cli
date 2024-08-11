import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, extname } from 'path';
import _startCase from 'lodash.startcase';
import _template from 'lodash.template';
import { getLogMessageInline } from './getLogMessageInline';
import { removeNonSvgFiles } from './removeNonSvgFiles';
import { optimize } from 'svgo';
import { renameSvgFiles } from './renameSvgFiles';
import { deleteDuplicateIcon } from './deleteDuplicateIcon';

export const handleSvgFile = (svgDirPath: string, file: string): void => {
    const filePath = resolve(svgDirPath, file);

    if (extname(file) !== '.svg') {
        try {
            removeNonSvgFiles(filePath, svgDirPath);
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const result = optimize(readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));
            const newFilePath = renameSvgFiles(svgDirPath, filePath, file);

            if (!file.startsWith('ico-')) {
                deleteDuplicateIcon(newFilePath);
                unlinkSync(filePath);
            }

            writeFileSync(newFilePath, result.data, { encoding: 'utf8', flag: 'w' });

            if (existsSync(filePath)) {
                getLogMessageInline(`Optimized ${file}`, 'cyan');
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
};
