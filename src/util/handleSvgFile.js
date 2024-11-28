import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, extname } from 'path';

import { getLogMessageInline } from './getLogMessageInline.js';
import { removeNonSvgFiles } from './removeNonSvgFiles.js';
import { optimize } from 'svgo';
import { renameSvgFiles } from './renameSvgFiles.js';
import { deleteDuplicateIcon } from './deleteDuplicateIcon.js';

export const handleSvgFile = (svgDirPath, file) => {
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

            if (file.startsWith('ico-')) {
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
