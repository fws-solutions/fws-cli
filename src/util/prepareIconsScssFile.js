import { readdirSync } from 'fs';
import { basename, join, relative } from 'path';

export const prepareIconsScssFile = (svgDirPath) => {
    let scssImports = '';
    readdirSync(svgDirPath).forEach((file) => {
        const iconName = basename(file, '.svg');
        const filePath = relative('src/scss', join(svgDirPath, file)).replace(/\\/g, '/');

        scssImports += `@if $icon == ${iconName} {\n`;
        scssImports += `\t$path: '${filePath}'\n`;
        scssImports += '}\n';
    });

    return scssImports;
};
