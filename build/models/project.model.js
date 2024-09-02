"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeSchema = exports.TextStyleSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TextStyleSchema = new mongoose_1.Schema({
    fontSize: { type: Number },
    fontFamily: { type: String },
    fontWeight: { type: Number, enum: [300, 400, 500, 600, 700] },
    fontStyle: { type: String, enum: ["italic", ""] },
    textDecoration: { type: String, enum: ["underline"] },
    textAlign: { type: String, enum: ["center", "start", "end"] },
});
exports.ShapeSchema = new mongoose_1.Schema({
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
    textStyle: { type: exports.TextStyleSchema },
});
const ProjectSchema = new mongoose_1.Schema({
    projectName: { type: String, required: false, default: "Untitle project" },
    thumbnail: { type: String, required: true, default: "/images/white.jpg" },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Authentication",
    },
    canvas: {
        type: {
            width: { type: Number, required: true },
            height: { type: Number, required: true },
            bgColor: { type: String, default: "#ffffff" },
        },
        required: true,
    },
    shapes: { type: [exports.ShapeSchema], required: false, default: [] },
    template: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
}, { timestamps: true });
const Project = (0, mongoose_1.model)("Project", ProjectSchema);
exports.default = Project;
