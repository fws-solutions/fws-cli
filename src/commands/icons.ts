import { ICommand } from '../interfaces/interfaces';
import { getPackageMetadata } from '../package';
import { resolve } from 'path';
import { handleSvgFiles } from '../util/handleSvgFiles';
import { generateIconsScssFile } from '../util/generateIconsScssFile';
import { generateAdditionalFiles } from '../util/generateAdditionalFiles';
import { getAssetsDir } from '../util/getAssetsDir';

const icons: ICommand = {
    name: 'icons',
    description: 'optimizes and generates SVG icons',
    alias: 'ic',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) process.exit(1);

        const appRoot = __dirname.split('src')[0];
        const assetsDir = getAssetsDir(packageMetadata.packageType, packageMetadata.projectRoot);
        const svgDirPath = resolve(packageMetadata.projectRoot, assetsDir, 'svg');

        handleSvgFiles(svgDirPath);
        if (packageMetadata.packageType === 'wp') {
            generateIconsScssFile(packageMetadata.projectRoot, appRoot, svgDirPath);
        }
        generateAdditionalFiles(appRoot, packageMetadata.projectRoot, svgDirPath, packageMetadata.packageType);
    },
};

icons.run = icons.run.bind(icons);

export { icons };
