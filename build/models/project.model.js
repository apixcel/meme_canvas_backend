"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TextStyleSchema = new mongoose_1.Schema({
    fontSize: { type: Number },
    fontFamily: { type: String },
    fontWeight: { type: Number, enum: [300, 400, 500, 600, 700] },
    fontStyle: { type: String, enum: ["italic", ""] },
    textDecoration: { type: String, enum: ["underline"] },
    textAlign: { type: String, enum: ["center", "start", "end"] },
});
const ShapeSchema = new mongoose_1.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    id: { type: String, required: true },
    color: { type: String, required: false, default: "#000" },
    rotation: { type: Number, required: false, default: 0 },
    type: {
        type: String,
        required: true,
        enum: ["rectangle", "circle", "image", "text"],
    },
    text: { type: String },
    radius: { type: Number, required: true },
    imageUrl: { type: String },
    zIndex: { type: Number, required: true },
    textStyle: { type: TextStyleSchema },
});
const ProjectSchema = new mongoose_1.Schema({
    projectName: { type: String, required: false, default: "Untitle project" },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Authentication",
    },
    canvas: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    shapes: { type: [ShapeSchema], required: false, default: [] },
}, { timestamps: true });
const Project = (0, mongoose_1.model)("Project", ProjectSchema);
exports.default = Project;
