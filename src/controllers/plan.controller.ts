import catchAsyncError from "../middlewares/catchAsyncErrors";
import Plan from "../models/plan.model";
import sendResponse from "../utils/sendResponse";

export const createPlan = catchAsyncError(async (req, res) => {
  const { name, stripePriceId, duration, description, price, credit } =
    req.body;

  const newPlan = new Plan({
    name,
    stripePriceId,
    duration,
    description,
    price,
    credit,
  });

  await newPlan.save();
  sendResponse(res, {
    data: newPlan,
    message: "Plan created successfully",
    success: true,
  });
});

export const getAllPlan = catchAsyncError(async (req, res) => {
  const result = await Plan.find().select("-stripePriceId");
  sendResponse(res, {
    data: result,
    success: true,
    message: "Plan retrive successfully",
  });
});
