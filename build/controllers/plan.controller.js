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
exports.getAllPlan = exports.createPlan = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const plan_model_1 = __importDefault(require("../models/plan.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.createPlan = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, stripePriceId, duration, description, price, credit } = req.body;
    const newPlan = new plan_model_1.default({
        name,
        stripePriceId,
        duration,
        description,
        price,
        credit,
    });
    yield newPlan.save();
    (0, sendResponse_1.default)(res, {
        data: newPlan,
        message: "Plan created successfully",
        success: true,
    });
}));
exports.getAllPlan = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield plan_model_1.default.find().select("-stripePriceId");
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        message: "Plan retrive successfully",
    });
}));
