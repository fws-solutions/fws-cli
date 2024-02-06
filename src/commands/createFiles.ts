import { checkIfOneOptionIsPresent } from '../util/checkIfOneOptionIsPresent';
import { ICommand, ICreateFilesOptions } from '../interfaces/interfaces';
import { getPackageMetadata } from '../package';

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
        console.log(packageMetadata);

        // TODO: finish create files command
    },
};

createFiles.run = createFiles.run.bind(createFiles);

export { createFiles };
