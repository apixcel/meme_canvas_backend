"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const project_model_1 = require("./project.model");
const TemplateSchema = new mongoose_1.Schema({
    projectName: { type: String, required: false, default: "Untitle project" },
    thumbnail: { type: String, required: true, default: "/images/white.jpg" },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Authentication",
    },
    canvas: {
        type: {
            width: { type: Number, required: true },
            height: { type: Number, required: true },
        },
        required: true,
    },
    shapes: { type: [project_model_1.ShapeSchema], required: false, default: [] },
}, { timestamps: true });
const Template = (0, mongoose_1.model)("Template", TemplateSchema);
exports.default = Template;
