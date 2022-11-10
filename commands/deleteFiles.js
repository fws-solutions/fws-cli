import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import path, {relative, resolve} from 'path';
import colors from 'ansi-colors';
import fs from 'fs';
import glob from 'glob';

export default class DeleteFeFiles extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('remove-fe', 'remove all _fe files in template-views directory')
                .setAlias('rfe')
        );
    }

    run() {
        this.validateCorrectPackage(this.isWPPackage());
        this._deleteFiles(
            this._filterFeFiles(
                this._getFiles()
            )
        );
    }

    _getFiles() {
        return glob.sync(resolve(this.package.getProjectRoot(), 'template-views/**/*.php'));
    }

    _filterFeFiles(files) {
        return files.filter((file) => {
            const fileStat = fs.lstatSync(file);
            const fileName = path.basename(file);
            return !fileStat.isDirectory() && path.extname(file) === '.php' && fileName.substring(0, 4) === '_fe-';
        });
    }

    _deleteFiles(files) {
        let count = 1;

        if (files.length === 0) {
            this.consoleLogSuccess('No FE files to delete');
            return;
        }
        this.consoleLogError('DELETED FE FILES:');+

        files.forEach((file)=>{
            try {
                fs.unlinkSync(file);
                console.log(colors.red(` ${count++}. ${relative(this.package.getProjectRoot(), file)}`));
            } catch (exception) {
                this.inlineLogError(exception);
            }
        })
    }
}
