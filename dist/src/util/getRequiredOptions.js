"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiredOptions = void 0;
const getRequiredOptions = (command) => {
    var _a;
    const returnOptions = [];
    if ((_a = command === null || command === void 0 ? void 0 : command.mandatoryOptions) === null || _a === void 0 ? void 0 : _a.length) {
        command.mandatoryOptions.forEach((option) => {
            returnOptions.push({ command: `${option.command}`, description: `${option.description}` });
        });
    }
    return returnOptions;
};
exports.getRequiredOptions = getRequiredOptions;
