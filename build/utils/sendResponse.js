"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode || 200).json({
        success: data.success,
        message: data.message,
        data: data.data,
        meta: data.meta,
        error: data.error,
    });
};
exports.default = sendResponse;
