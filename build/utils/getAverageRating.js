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
exports.getAverageRating = getAverageRating;
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = __importDefault(require("../models/review.model"));
function getAverageRating(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield review_model_1.default.aggregate([
                {
                    $match: { productId: new mongoose_1.default.Types.ObjectId(productId) },
                },
                {
                    $group: {
                        _id: "$productId",
                        averageRating: { $avg: "$rating" },
                    },
                },
            ]);
            if (result.length > 0) {
                return result[0].averageRating;
            }
            else {
                return null; // No reviews found for the given productId
            }
        }
        catch (error) {
            console.error("Error getting average rating:", error);
            throw error;
        }
    });
}
