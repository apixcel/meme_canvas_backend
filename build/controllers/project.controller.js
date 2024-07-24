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
exports.getAllImages = exports.uploadImage = exports.deleteProject = exports.renameProject = exports.updateProjectShapes = exports.createProjectController = exports.getProjectById = exports.getAllProjects = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const image_model_1 = __importDefault(require("../models/image.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const uploadFile_1 = require("../utils/uploadFile");
exports.getAllProjects = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const isExist = yield project_model_1.default.find({ user: user.id })
        .select("projectName createdAt updatedAt")
        .sort({ updatedAt: -1 });
    (0, sendResponse_1.default)(res, {
        data: isExist,
        success: true,
        message: "projects retrived successfully",
    });
}));
exports.getProjectById = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const isExist = yield project_model_1.default.findById(id).populate("user");
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "project not found on this id",
        });
    }
    const auth = isExist.toObject().user;
    if (!auth._id || auth._id.toString() !== user.id) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "forbiden access",
            statusCode: 403,
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        data: isExist,
        success: true,
        message: "project retrived successfully",
    });
}));
exports.createProjectController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = req.user;
    const result = yield project_model_1.default.create(Object.assign(Object.assign({}, body), { user: user.id }));
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "project created successfuly",
        success: true,
    });
}));
exports.updateProjectShapes = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    const user = req.user;
    const isExist = yield project_model_1.default.findById(id).populate("user");
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "project not found on this id",
        });
    }
    const auth = isExist.toObject().user;
    if (!auth._id || auth._id.toString() !== user.id) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "forbiden access",
            statusCode: 403,
            data: null,
        });
    }
    const result = yield project_model_1.default.findByIdAndUpdate(id, {
        $set: { shapes: body },
    }, { runValidators: true, new: true });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "project created successfuly",
        success: true,
    });
}));
exports.renameProject = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectName } = req.body;
    const { id } = req.params;
    const user = req.user;
    const isExist = yield project_model_1.default.findById(id).populate("user");
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "project not found on this id",
        });
    }
    const auth = isExist.toObject().user;
    if (!auth._id || auth._id.toString() !== user.id) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "forbiden access",
            statusCode: 403,
            data: null,
        });
    }
    const result = yield project_model_1.default.findByIdAndUpdate(id, {
        $set: { projectName },
    }, { runValidators: true, new: true });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "project created successfuly",
        success: true,
    });
}));
exports.deleteProject = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const isExist = yield project_model_1.default.findById(id).populate("user");
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "project not found on this id",
        });
    }
    const auth = isExist.toObject().user;
    if (!auth._id || auth._id.toString() !== user.id) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "forbiden access",
            statusCode: 403,
            data: null,
        });
    }
    const result = yield project_model_1.default.findByIdAndDelete(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "project deleted succesfuly",
        success: true,
        statusCode: 200,
    });
}));
exports.uploadImage = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield image_model_1.default.create({ url: uploadRes.secure_url, user: user.id });
    (0, sendResponse_1.default)(res, {
        data: uploadRes.secure_url,
        message: "image uploaded",
        success: true,
    });
}));
exports.getAllImages = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield image_model_1.default.find({ user: user.id });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        message: "Successfully get user images",
    });
}));
