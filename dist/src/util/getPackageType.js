"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageType = void 0;
const packageTypes_1 = require("../consts/packageTypes");
const getPackageType = (packageJson) => {
    if (!packageJson || !(packageJson === null || packageJson === void 0 ? void 0 : packageJson.forwardslash))
        return 'unknown';
    return packageTypes_1.PACKAGE_TYPES[packageJson.forwardslash].type;
};
exports.getPackageType = getPackageType;
