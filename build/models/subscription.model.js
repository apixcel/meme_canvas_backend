"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plan: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    stripeSubscriptionId: {
        type: String,
        required: false,
        default: "",
    },
    currentCredit: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Subscription = mongoose_1.default.model("Subscription", subscriptionSchema);
exports.default = Subscription;
