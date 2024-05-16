import { resolve } from 'path';

export const renameSvgFiles = (svgDirPath: string, filePath: string, file: string): string => {
    let newFilePath = filePath;
    if (file.substring(0, 4) !== 'ico-') {
        let newFileName = file
            .toLowerCase()
            .replace(/\.svg$/, '')
            .replace(/-/g, ' ')
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .replace(/^(-+)/, '')
            .replace(/(-+)$/, '')
            .replace(/-{2,}/g, '-')
            .replace(/^-/, '')
            .replace(/-$/, '');

        newFilePath = resolve(svgDirPath, `ico-${newFileName}.svg`);
    }

    return newFilePath;
};
