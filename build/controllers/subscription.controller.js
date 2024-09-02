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
exports.upgradeSubscriptionPlan = exports.createSubscription = void 0;
const app_1 = require("../app");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const plan_model_1 = __importDefault(require("../models/plan.model"));
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.createSubscription = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, planId, email, paymentMethodId } = req.body;
    const user = yield auth_model_1.default.findById(userId);
    const plan = yield plan_model_1.default.findById(planId);
    if (!user || !plan) {
        console.log({ user, plan });
        return res.status(404).json({ message: "User or Plan not found" });
    }
    if (!user.stripeCustomerId) {
        const customer = yield app_1.stripe.customers.create({
            email,
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        user.stripeCustomerId = customer.id;
        yield user.save();
    }
    const subscription = yield app_1.stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: plan.stripePriceId }],
    });
    // Create a new Subscription document
    const newSubscription = yield subscription_model_1.default.findOneAndUpdate({ user: user._id }, {
        plan: plan._id,
        stripeSubscriptionId: subscription.id,
        currentCredit: plan.credit,
    }, { new: true });
    // Update the user's subscription reference
    user.subscription = newSubscription === null || newSubscription === void 0 ? void 0 : newSubscription._id;
    yield user.save();
    (0, sendResponse_1.default)(res, {
        message: "Subscription created successfully",
        data: newSubscription,
        success: true,
    });
}));
exports.upgradeSubscriptionPlan = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newPlanId } = req.body;
    // Find the user
    const user = yield auth_model_1.default.findById(userId).populate("subscription");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Find the new plan
    const newPlan = yield plan_model_1.default.findById(newPlanId);
    if (!newPlan || !newPlanId.stripePriceId) {
        return res.status(404).json({ message: "Plan not found" });
    }
    // Get the current subscription
    const subscription = user.subscription;
    const subscriptionId = subscription.stripeSubscriptionId;
    // Update the subscription with the new plan
    const updatedSubscription = yield app_1.stripe.subscriptions.update(subscriptionId, {
        items: [
            {
                id: subscription.stripeSubscriptionItemId, // This is the ID of the subscription item to update
                price: newPlan.stripePriceId, // The price ID of the new plan
            },
        ],
        proration_behavior: "create_prorations", // Optional: Handle proration of charges
    });
    // Update the user's subscription details in the database
    yield subscription_model_1.default.findByIdAndUpdate(user._id, { plan: newPlan._id });
}));
