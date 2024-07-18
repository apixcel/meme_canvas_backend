import { model, Schema } from "mongoose";

const imageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Authentication",
    },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const Image = model("image", imageSchema);

export default Image;
