"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageBasedOnCode = void 0;
const getMessageBasedOnCode = (code, message) => {
    return code === 0
        ? `${message} succeeded!`
        : code === 1
            ? `${message} failed!`
            : `${message} exited with code ${code}`;
};
exports.getMessageBasedOnCode = getMessageBasedOnCode;
