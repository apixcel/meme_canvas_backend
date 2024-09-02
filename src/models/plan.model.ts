import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
