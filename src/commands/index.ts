import { ICommand } from '../interfaces/interfaces';
import { npmci } from './npmci';
import { npmi } from './npmi';
import { createFiles } from './createFiles';
import { deleteFEFiles } from './deleteFEFiles';
import { icons } from './icons';
import { latestVersion } from './latestVersion';
import { postInstall } from './postinstall';
import { w3validator } from './w3validator';

export const commands: Array<ICommand> = [
    npmi,
    npmci,
    createFiles,
    deleteFEFiles,
    icons,
    latestVersion,
    postInstall,
    w3validator,
];
