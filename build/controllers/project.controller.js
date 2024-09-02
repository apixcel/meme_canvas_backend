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
exports.getAllImages = exports.uploadImage = exports.deleteProject = exports.renameProject = exports.updateProjectCanvasColor = exports.updateProjectThubnail = exports.updateProjectShapes = exports.createProjectController = exports.getProjectById = exports.getAllProjects = void 0;
const cloud_1 = __importDefault(require("../config/cloud"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const image_model_1 = __importDefault(require("../models/image.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const getPublicId_1 = require("../utils/getPublicId");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const uploadFile_1 = require("../utils/uploadFile");
exports.getAllProjects = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const isExist = yield project_model_1.default.find({ user: user._id })
        .select("projectName createdAt updatedAt thumbnail")
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
    if (!auth._id || auth._id.toString() !== user._id.toString()) {
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
    const result = yield project_model_1.default.create(Object.assign(Object.assign({}, body), { user: user._id }));
    yield subscription_model_1.default.findByIdAndUpdate(user.subscription, {
        $inc: { currentCredit: -1 },
    });
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
    if (!auth._id || auth._id.toString() !== user._id.toString()) {
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
exports.updateProjectThubnail = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    const user = req.user;
    const file = req.file;
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const isExist = yield project_model_1.default.findById(id).populate("user");
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "project not found on this id",
        });
    }
    const asset_public_id = (0, getPublicId_1.getPublicId)(isExist.thumbnail);
    if (asset_public_id) {
        const result1 = yield cloud_1.default.uploader.destroy(asset_public_id);
    }
    const uploadRes = yield (0, uploadFile_1.sendImageToCloudinary)(file.filename, file.path);
    const auth = isExist.toObject().user;
    if (!auth._id || auth._id.toString() !== user._id.toString()) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "forbiden access",
            statusCode: 403,
            data: null,
        });
    }
    const result = yield project_model_1.default.findByIdAndUpdate(id, {
        $set: { thumbnail: uploadRes.secure_url || "" },
    }, { runValidators: true, new: true });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "project thubmain updated successfuly",
        success: true,
    });
}));
exports.updateProjectCanvasColor = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bgColor } = req.body;
    const id = req.params.id;
    const result = yield project_model_1.default.findByIdAndUpdate(id, {
        $set: { "canvas.bgColor": bgColor },
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "Canvas color updated",
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
    if (!auth._id || auth._id.toString() !== user._id.toString()) {
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
    if (!auth._id || auth._id.toString() !== user._id.toString()) {
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
    yield image_model_1.default.create({ url: uploadRes.secure_url, user: user._id });
    (0, sendResponse_1.default)(res, {
        data: uploadRes.secure_url,
        message: "image uploaded",
        success: true,
    });
}));
exports.getAllImages = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield image_model_1.default.find({ user: user._id });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        message: "Successfully get user images",
    });
}));
