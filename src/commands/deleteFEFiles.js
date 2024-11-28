import { getPackageMetadata } from '../package/index.js';
import { getFiles } from '../util/getFiles.js';
import { deleteFiles } from '../util/deleteFiles.js';
import { resolve } from 'path';

const deleteFEFiles = {
    name: 'remove-fe',
    description: 'remove all _fe files in template-views directory',
    alias: 'rfe',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error('Delete FE files failed.', 1);

        const feFiles = getFiles(resolve(packageMetadata.projectRoot, 'template-views'), '.php', '_fe-');
        deleteFiles(feFiles, 'No FE files to delete', 'DELETED FE FILES:');
    },
};

deleteFEFiles.run = deleteFEFiles.run.bind(deleteFEFiles);

export { deleteFEFiles };
