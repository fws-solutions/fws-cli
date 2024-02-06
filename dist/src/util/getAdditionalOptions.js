"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalOptions = void 0;
const getAdditionalOptions = (command) => {
    var _a;
    const returnOptions = [];
    if ((_a = command === null || command === void 0 ? void 0 : command.additionalOptions) === null || _a === void 0 ? void 0 : _a.length) {
        command.additionalOptions.forEach((option) => {
            returnOptions.push({ command: `${option.command}`, description: `${option.description}` });
        });
    }
    return returnOptions;
};
exports.getAdditionalOptions = getAdditionalOptions;
