import { checkIfOneOptionIsPresent } from '../util/checkIfOneOptionIsPresent';
import { createFile } from '../util/createFile';
import { updateScssFile } from '../util/updateScssFile';
import { ICommand, ICreateFilesOptions } from '../interfaces/interfaces';
import { getPackageMetadata } from '../package';
import { getDirType } from '../util/getDirType';
import { resolve } from 'path';
import _startCase from 'lodash.startcase';
import { validateDirectory } from '../util/validateDirectory';
import { createDirectory } from '../util/createDirectory';
import { rollBack } from '../util/rollBack';
import { isVueComponentExist } from '../util/isVueComponentExists';
import { getVueComponentDirectory } from '../util/getVueComponentDirectory';
import { generateVueFile } from '../util/generateVueFile';
import { generateVueStory } from '../util/generateVueStory';
import { getLogMessage } from '../util/getLogMessage';

const createFiles: ICommand = {
    name: 'create-file',
    description: 'create component files',
    alias: 'cf',
    mandatoryOptions: [{ command: '-fn, --file-name <filename>', description: 'file name, mandatory' }],
    additionalOptions: [
        { command: '-b, --block', description: 'create WP block, 1 type of component mandatory' },
        { command: '-l, --listing', description: 'create WP listing, 1 type of component mandatory' },
        { command: '-p, --part', description: 'create WP part, 1 type of component mandatory' },
        { command: '-B, --block-vue', description: 'create Vue block, 1 type of component mandatory' },
        { command: '-P, --part-vue', description: 'create Vue part, 1 type of component mandatory' },
    ],
    run(options: ICreateFilesOptions) {
        const { fileName, block, listing, part, blockVue, partVue } = options;
        if (!fileName) {
            console.error('Please provide a file name.');
            process.exit(1);
        }
        const { message, shouldExit } = checkIfOneOptionIsPresent(this.additionalOptions!, [
            block,
            listing,
            part,
            blockVue,
            partVue,
        ]);
        message && console.error(message);
        shouldExit && process.exit(1);
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) process.exit(1);

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
