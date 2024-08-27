"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicId = void 0;
const getPublicId = (url) => {
    const regex = /\/upload\/(?:v\d+\/)?([^/.]+)\.[a-z]+$/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return "";
};
exports.getPublicId = getPublicId;
