"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestVersion = void 0;
const package_1 = require("../package");
const getCurrentVersion_1 = require("../util/getCurrentVersion");
const getLatestVersion_1 = require("../util/getLatestVersion");
const checkUpdateVersion_1 = require("../util/checkUpdateVersion");
const latestVersion = {
    name: 'latest-version',
    description: 'check for latest CLI version',
    alias: 'latest',
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const packageMetadata = (0, package_1.getPackageMetadata)();
            if (!(packageMetadata === null || packageMetadata === void 0 ? void 0 : packageMetadata.isValid))
                process.exit(1);
            const currentVersion = (0, getCurrentVersion_1.getCurrentVersion)();
            const latestVersion = yield (0, getLatestVersion_1.getLatestVersion)();
            (0, checkUpdateVersion_1.checkUpdateVersion)(currentVersion, latestVersion);
        });
    },
};
exports.latestVersion = latestVersion;
latestVersion.run = latestVersion.run.bind(latestVersion);
