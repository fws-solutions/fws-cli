"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFiles = void 0;
const checkIfOneOptionIsPresent_1 = require("../util/checkIfOneOptionIsPresent");
const package_1 = require("../package");
const createFiles = {
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
    run(options) {
        const { fileName, block, listing, part, blockVue, partVue } = options;
        if (!fileName) {
            console.error('Please provide a file name.');
            process.exit(1);
        }
        const { message, shouldExit } = (0, checkIfOneOptionIsPresent_1.checkIfOneOptionIsPresent)(this.additionalOptions, [
            block,
            listing,
            part,
            blockVue,
            partVue,
        ]);
        message && console.error(message);
        shouldExit && process.exit(1);
        const packageMetadata = (0, package_1.getPackageMetadata)();
        console.log(packageMetadata);
        // TODO: finish create files command
    },
};
exports.createFiles = createFiles;
createFiles.run = createFiles.run.bind(createFiles);
