"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const planSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    stripePriceId: {
        type: String,
        required: false, // This is the Stripe price ID
        default: "",
    },
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    credit: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
}, { timestamps: true });
const Plan = mongoose_1.default.model("Plan", planSchema);
exports.default = Plan;
