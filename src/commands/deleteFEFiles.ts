import { getPackageMetadata } from '../package';
import { ICommand } from '../interfaces/interfaces';
import { getFiles } from '../util/getFiles';
import { deleteFiles } from '../util/deleteFiles';
import { resolve } from 'path';

const deleteFEFiles: ICommand = {
    name: 'remove-fe',
    description: 'remove all _fe files in template-views directory',
    alias: 'rfe',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) process.exit(1);

        const feFiles = getFiles(resolve(packageMetadata.projectRoot, 'template-views'), '.php', '_fe-');
        deleteFiles(feFiles, 'No FE files to delete', 'DELETED FE FILES:');
    },
};

deleteFEFiles.run = deleteFEFiles.run.bind(deleteFEFiles);

export { deleteFEFiles };
