"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const npmci_1 = require("./npmci");
const npmi_1 = require("./npmi");
const createFiles_1 = require("./createFiles");
const deleteFEFiles_1 = require("./deleteFEFiles");
const icons_1 = require("./icons");
const latestVersion_1 = require("./latestVersion");
const postinstall_1 = require("./postinstall");
const w3validator_1 = require("./w3validator");
exports.commands = [
    npmi_1.npmi,
    npmci_1.npmci,
    createFiles_1.createFiles,
    deleteFEFiles_1.deleteFEFiles,
    icons_1.icons,
    latestVersion_1.latestVersion,
    postinstall_1.postInstall,
    w3validator_1.w3validator,
];
