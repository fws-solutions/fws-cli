"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedCommands = void 0;
const packageTypes_1 = require("../consts/packageTypes");
const getAllowedCommands = (packageJson) => {
    if (!packageJson || !(packageJson === null || packageJson === void 0 ? void 0 : packageJson.forwardslash))
        return [];
    return packageTypes_1.PACKAGE_TYPES[packageJson.forwardslash].allowedCommands;
};
exports.getAllowedCommands = getAllowedCommands;
