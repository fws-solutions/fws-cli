import { createLandoYmlFile } from '../util/createLandoYmlFile.js';
import { getPackageMetadata } from '../package/index.js';
import { getLogMessage } from '../util/getLogMessage.js';
import { rollBack } from '../util/rollBack.js';
import { resolve } from 'path';

const createLandoFile = {
    name: 'create-lando-file',
    description: 'create lando yml file',
    alias: 'clf',
    mandatoryOptions: [
        { command: '-n, --project-name <projectName>', description: 'project name, mandatory' },
        { command: '-p, --php-version <phpVersion>', description: 'php version, mandatory' },
        { command: '-t, --theme-name <themeName>', description: 'theme name, mandatory' },
    ],
    run(options) {
        const { projectName, phpVersion, themeName } = options;
        if (!projectName) {
            console.error('Please provide a file name.');
            throw new Error('Script: create-lando-file failed with code: 1');
        }
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error('Script: create-lando-file failed with code: 1');

        try {
            if (packageMetadata.packageType === 'wp') {
                const dirPath = resolve(resolve(process.cwd(), '../../../'), 'lando.yml');
                createLandoYmlFile(dirPath, projectName, phpVersion, themeName, 'temp-lando-yml.txt', packageMetadata);
            } else {
                getLogMessage('Wrong package...', 'yellow');
            }
        } catch (exception) {
            rollBack();
        }
    },
};

createLandoFile.run = createLandoFile.run.bind(createLandoFile);

export { createLandoFile };
