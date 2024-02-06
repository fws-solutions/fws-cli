"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.w3validator = void 0;
const package_1 = require("../package");
const w3validator = {
    name: 'w3Validator',
    description: 'validate via w3 api',
    alias: 'w3',
    mandatoryOptions: [{ command: '-url, --url <url>', description: 'url, mandatory' }],
    run(options) {
        const { url } = options;
        console.log('running w3 validator command', url);
        const packageMetadata = (0, package_1.getPackageMetadata)();
        console.log(packageMetadata);
    },
};
exports.w3validator = w3validator;
w3validator.run = w3validator.run.bind(w3validator);
