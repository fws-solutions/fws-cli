import { readdirSync } from 'fs';
import { basename, join, relative } from 'path';
import _template from 'lodash.template';

export const prepareIconsScssFile = (svgDirPath: string): string => {
    let scssImports = '';
    readdirSync(svgDirPath).forEach((file) => {
        const iconName = basename(file, '.svg');
        const filePath = relative('src/scss', join(svgDirPath, file)).replace(/\\/g, '/');
        const relativePath = '../' + filePath.split('/src/')[1];

        scssImports += `@if $icon == ${iconName} {\n`;
        scssImports += `\t$path: '${relativePath}'\n`;
        scssImports += '}\n';
    });

    return scssImports;
};
