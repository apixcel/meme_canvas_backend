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
exports.checkPlanLimit = void 0;
const app_1 = require("../app");
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const checkPlanLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const subscriptionPlan = yield subscription_model_1.default.findById(user.subscription);
        if (!subscriptionPlan) {
            return (0, sendResponse_1.default)(res, {
                data: null,
                success: false,
                message: "No Subscription plan found",
                statusCode: 403,
            });
        }
        if (!subscriptionPlan.currentCredit || subscriptionPlan.currentCredit < 1) {
            return (0, sendResponse_1.default)(res, {
                message: "Maximum credit reached",
                data: null,
                success: false,
                statusCode: 400,
            });
        }
        if (!user.stripeCustomerId) {
            return next();
        }
        const subscriptionId = subscriptionPlan.stripeSubscriptionId || "";
        // Check if subscription is active and matches the required plan
        const subscription = yield app_1.stripe.subscriptions.retrieve(subscriptionId);
        if (subscription.status === "active") {
            return next();
        }
        (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "Subscription plan is not active anymore",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.checkPlanLimit = checkPlanLimit;
