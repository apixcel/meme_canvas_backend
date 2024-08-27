import { model, Schema } from "mongoose";
import { ShapeSchema } from "./project.model";

const TemplateSchema = new Schema(
  {
    projectName: { type: String, required: false, default: "Untitle project" },
    thumbnail: { type: String, required: true, default: "/images/white.jpg" },

    owner: {
      type: Schema.Types.ObjectId,
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
    shapes: { type: [ShapeSchema], required: false, default: [] },
  },
  { timestamps: true }
);

const Template = model("Template", TemplateSchema);

export default Template;
