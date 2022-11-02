import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import path, {relative, resolve} from 'path';
import colors from 'ansi-colors';
import fs from 'fs';
import glob from 'glob';

export default class DeleteFiles extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('remove-fe', 'remove all _fe files in template-views directory')
        );
    }

    run() {
        this.showStartMessage();
        this._deleteFeFiles();
    }

    _getFiles() {
        let dirPath = '';
        if (this.isWPPackage()) dirPath = resolve(this.package.getProjectRoot(), 'template-views/**/*.php');
        else {
            this.consoleLogError('Unknown package type!');
            this.showEndMessage();
        }

        return glob.sync(dirPath);
    }

    _filterFeFiles() {
        return this._getFiles().filter((file) => {
            const fileStat = fs.lstatSync(file);
            const fileName = path.basename(file);
            return !fileStat.isDirectory() && path.extname(file) === '.php' && fileName.substring(0, 4) === '_fe-';
        });
    }

    _deleteFeFiles() {
        let count = 1;
        const files = this._filterFeFiles();

        if (files.length === 0) {
            this.consoleLogSuccess('No FE files to delete');
            this.showEndMessage();
        }
        this.consoleLogError('DELETED FE FILES:');

        files.forEach((file)=>{
            try {
                fs.unlinkSync(file);
                console.log(colors.red(` ${count++}. ${relative(this.package.getProjectRoot(), file)}`));
            } catch (exception) {
                this.inlineLogError(exception);
            }
        })
        this.showEndMessage();
    }
}
