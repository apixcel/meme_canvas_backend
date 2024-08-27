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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = exports.updateUserProfileImage = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const uploadFile_1 = require("../utils/uploadFile");
exports.updateUserProfileImage = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const user = req.user;
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const uploadRes = yield (0, uploadFile_1.sendImageToCloudinary)(file.filename, file.path);
    const url = uploadRes.secure_url;
    if (!url) {
        return (0, sendResponse_1.default)(res, {
            message: "failed to upload image",
            success: false,
            data: null,
            statusCode: 400,
        });
    }
    console.log(user);
    const result = yield auth_model_1.default.findByIdAndUpdate(user._id, { image: url }, { new: true, runValidators: true });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "image updated successfully",
        statusCode: 200,
        success: true,
    });
}));
exports.updateUserInfo = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = req.user;
    ["email", "role", "image"].forEach((item) => delete body[item]);
    const result = yield auth_model_1.default.findByIdAndUpdate(user._id, body, {
        new: true,
        runValidators: true,
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "user profile updated successfully",
        statusCode: 200,
        success: true,
    });
}));
