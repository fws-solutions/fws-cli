import { getPackageMetadata } from '../package/index.js';
import { resolve } from 'path';
import { handleSvgFiles } from '../util/handleSvgFiles.js';
import { generateIconsScssFile } from '../util/generateIconsScssFile.js';
import { generateAdditionalFiles } from '../util/generateAdditionalFiles.js';
import { getAssetsDir } from '../util/getAssetsDir.js';

const icons = {
    name: 'icons',
    description: 'optimizes and generates SVG icons',
    alias: 'ic',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error('Icons failed.', 1);

        const appRoot = import.meta.dirname.split('src')[0];
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
