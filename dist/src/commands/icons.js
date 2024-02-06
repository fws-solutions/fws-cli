"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icons = void 0;
const package_1 = require("../package");
const icons = {
    name: 'icons',
    description: 'optimizes and generates SVG icons',
    alias: 'ic',
    run() {
        console.log('running icons command');
        const packageMetadata = (0, package_1.getPackageMetadata)();
        console.log(packageMetadata);
        // TODO: finish icons command
    },
};
exports.icons = icons;
icons.run = icons.run.bind(icons);
