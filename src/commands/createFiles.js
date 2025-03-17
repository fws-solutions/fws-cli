import { checkIfOneOptionIsPresent } from '../util/checkIfOneOptionIsPresent.js';
import { createFile } from '../util/createFile.js';
import { updateScssFile } from '../util/updateScssFile.js';
import { getPackageMetadata } from '../package/index.js';
import { getDirType } from '../util/getDirType.js';
import { resolve } from 'path';
import _startCase from 'lodash.startcase';
import { validateDirectory } from '../util/validateDirectory.js';
import { createDirectory } from '../util/createDirectory.js';
import { rollBack } from '../util/rollBack.js';
import { isVueComponentExist } from '../util/isVueComponentExists.js';
import { getVueComponentDirectory } from '../util/getVueComponentDirectory.js';
import { generateVueFile } from '../util/generateVueFile.js';
import { generateVueStory } from '../util/generateVueStory.js';
import { getLogMessage } from '../util/getLogMessage.js';

const createFiles = {
    name: 'create-file',
    description: 'create component files',
    alias: 'cf',
    mandatoryOptions: [{ command: '-f, --file-name <filename>', description: 'file name, mandatory' }],
    additionalOptions: [
        { command: '-b, --block', description: 'create WP block, 1 type of component mandatory' },
        { command: '-l, --listing', description: 'create WP listing, 1 type of component mandatory' },
        { command: '-p, --part', description: 'create WP part, 1 type of component mandatory' },
        { command: '-B, --block-vue', description: 'create Vue block, 1 type of component mandatory' },
        { command: '-P, --part-vue', description: 'create Vue part, 1 type of component mandatory' },
    ],
    run(options) {
        const { fileName, block, listing, part, blockVue, partVue } = options;
        if (!fileName) {
            console.error('Please provide a file name.');
            throw new Error('Script: create-file failed with code: 1');
        }
        const { message, shouldExit } = checkIfOneOptionIsPresent(this.additionalOptions, [
            block,
            listing,
            part,
            blockVue,
            partVue,
        ]);
        message && console.error(message);
        if (shouldExit) throw new Error('Script: create-file failed with code: 1');
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error('Script: create-file failed with code: 1');

        const type = Object.entries(options)[1][0];
        const dirName = _startCase(fileName).replace(/[\s]+/g, '-').toLowerCase();
        const dirType = getDirType(type);
        const dirPath = resolve(packageMetadata.projectRoot, `template-views/${dirType}s/${dirName}`);

        try {
            if (['block', 'listing', 'part'].includes(type) && packageMetadata.packageType === 'wp') {
                validateDirectory(dirPath, `ERROR: ${dirType} '${dirName}' already exists!`);
                createDirectory(dirPath);
                createFile(dirName, dirType, 'php', '', 'php', dirPath);
                createFile(dirName, dirType, 'php-fe', '_fe-', 'php', dirPath);
                createFile(dirName, dirType, 'scss', '_', 'scss', dirPath);
                updateScssFile(packageMetadata.projectRoot, dirType, dirName);
            } else if (['blockVue', 'partVue'].includes(type) && packageMetadata.packageType !== 'wp') {
                const vueComponentDir = getVueComponentDirectory(packageMetadata);
                const componentName = (_startCase(dirType) + _startCase(dirName)).replace(/[\s]+/g, '');
                const filePath = resolve(
                    packageMetadata.projectRoot,
                    vueComponentDir + `/${dirType}s`,
                    `${fileName}.vue`
                );

                isVueComponentExist(filePath, componentName);
                generateVueFile(packageMetadata.packageType, componentName, fileName, filePath);
                generateVueStory(packageMetadata, componentName, dirType, fileName);
            } else {
                getLogMessage('Wrong package...', 'yellow');
            }
        } catch (exception) {
            rollBack();
        }
    },
};

createFiles.run = createFiles.run.bind(createFiles);

export { createFiles };
