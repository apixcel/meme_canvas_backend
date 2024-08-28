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
exports.deleteTemplate = exports.getAllTemplates = exports.createTemplate = exports.chooseTemplate = void 0;
const QueryBuilder_1 = __importDefault(require("../builder/QueryBuilder"));
const cloud_1 = __importDefault(require("../config/cloud"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const project_model_1 = __importDefault(require("../models/project.model"));
const template_model_1 = __importDefault(require("../models/template.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
// create  project from chosen template
exports.chooseTemplate = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const templateId = req.params.id; // template id
    const user = req.user;
    const isTemplateExists = yield template_model_1.default.findById(templateId);
    if (!isTemplateExists) {
        return (0, sendResponse_1.default)(res, {
            message: "Template not found",
            data: null,
            success: false,
            statusCode: 400,
        });
    }
    const alreadyChoosed = yield project_model_1.default.findOne({
        template: isTemplateExists._id,
    });
    if (alreadyChoosed) {
        return (0, sendResponse_1.default)(res, {
            data: alreadyChoosed,
            success: false,
            message: "this template is already choosed",
        });
    }
    const { canvas, projectName, shapes, _id } = isTemplateExists.toObject();
    const project = yield project_model_1.default.create({
        canvas,
        shapes,
        projectName,
        user: user._id,
        template: _id,
    });
    (0, sendResponse_1.default)(res, {
        data: project,
        message: "Project created form template",
        success: true,
    });
}));
exports.createTemplate = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params; // project id
    const { templateName } = req.body;
    const project = yield project_model_1.default.findById(id);
    if (!project) {
        return (0, sendResponse_1.default)(res, {
            message: "project not found",
            success: false,
            data: null,
        });
    }
    if (user._id.toString() !== project.user.toString()) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            message: "Unauthorized access",
            success: false,
            statusCode: 403,
        });
    }
    const { canvas, projectName, shapes, thumbnail } = project.toObject();
    const cloudinaryResult = yield cloud_1.default.uploader.upload(thumbnail);
    const result = yield template_model_1.default.create({
        canvas,
        owner: user._id,
        projectName: templateName || projectName,
        shapes,
        thumbnail: cloudinaryResult.secure_url,
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "Template deleted succesfuly",
        success: true,
        statusCode: 200,
    });
}));
exports.getAllTemplates = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = template_model_1.default.find().populate("owner").select("-shapes");
    const builder = new QueryBuilder_1.default(query, req.query).search(["projectName"]);
    const totalDoc = (yield builder.count()).totalCount;
    const result = yield builder.modelQuery;
    res.json({
        data: result,
        message: "successfully get all template",
        success: true,
        totalDoc,
    });
}));
exports.deleteTemplate = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const isExist = yield template_model_1.default.findById(id).populate("owner");
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "template not found on this id",
        });
    }
    const author = isExist.toObject().owner;
    if (author._id || author._id.toString() !== user._id.toString()) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "forbiden access",
            statusCode: 403,
            data: null,
        });
    }
    const result = yield template_model_1.default.findByIdAndDelete(isExist._id);
    (0, sendResponse_1.default)(res, {
        data: result,
        message: "Template deleted succesfuly",
        success: true,
        statusCode: 200,
    });
}));
