import { model, Schema } from "mongoose";
const TextStyleSchema = new Schema({
  fontSize: { type: Number },
  fontFamily: { type: String },
  fontWeight: { type: Number, enum: [300, 400, 500, 600, 700] },
  fontStyle: { type: String, enum: ["italic", ""] },
  textDecoration: { type: String, enum: ["underline"] },
  textAlign: { type: String, enum: ["center", "start", "end"] },
});

const ShapeSchema = new Schema({
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

const ProjectSchema = new Schema(
  {
    projectName: { type: String, required: false, default: "Untitle project" },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Authentication",
    },
    canvas: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    shapes: { type: [ShapeSchema], required: false, default: [] },
  },
  { timestamps: true }
);

const Project = model("Project", ProjectSchema);

export default Project;
