import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import _ from 'lodash';
import { fileURLToPath } from 'url';

export const compileTemplate = (templateFile, data, packageMetadata) => {
    const appRoot = dirname(fileURLToPath(import.meta.url)).split('src')[0] ?? '';
    const themeVersion = packageMetadata.packageJson?.version;
    const isNewWPStarter =
        themeVersion && packageMetadata.packageType === 'wp' && parseInt(themeVersion.split('.')[0], 10) >= 4;
    const filePath = isNewWPStarter ? `${appRoot}src/templates/other/new-wp-starter` : `${appRoot}src/templates/other/`;
    const template = readFileSync(resolve(filePath, templateFile), 'utf8');
    return _.template(template)(data);
};
