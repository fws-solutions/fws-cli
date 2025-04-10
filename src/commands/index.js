import { npmci } from './npmci.js';
import { npmi } from './npmi.js';
import { createFiles } from './createFiles.js';
import { deleteFEFiles } from './deleteFEFiles.js';
import { icons } from './icons.js';
import { latestVersion } from './latestVersion.js';
import { postInstall } from './postinstall.js';
import { w3validator } from './w3validator.js';
import { createLandoFile } from './createLandoFile.js';

export const commands = [
    npmi,
    npmci,
    createFiles,
    createLandoFile,
    deleteFEFiles,
    icons,
    latestVersion,
    postInstall,
    w3validator,
];
