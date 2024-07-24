"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Authentication",
    },
    url: { type: String, required: true },
}, { timestamps: true });
const Image = (0, mongoose_1.model)("image", imageSchema);
exports.default = Image;
