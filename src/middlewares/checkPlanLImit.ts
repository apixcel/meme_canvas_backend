import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";
import { stripe } from "../app";
import Subscription from "../models/subscription.model";
import sendResponse from "../utils/sendResponse";

export const checkPlanLimit: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as JwtPayload;
    const subscriptionPlan = await Subscription.findById(user.subscription);
    if (!subscriptionPlan) {
      return sendResponse(res, {
        data: null,
        success: false,
        message: "No Subscription plan found",
        statusCode: 403,
      });
    }

    if (!subscriptionPlan.currentCredit || subscriptionPlan.currentCredit < 1) {
      return sendResponse(res, {
        message: "Maximum credit reached",
        data: null,
        success: false,
        statusCode: 400,
      });
    }

    if (!user.stripeCustomerId) {
      return next();
    }

    const subscriptionId = subscriptionPlan.stripeSubscriptionId || "";

    // Check if subscription is active and matches the required plan
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (subscription.status === "active") {
      return next();
    }

    sendResponse(res, {
      data: null,
      success: false,
      message: "Subscription plan is not active anymore",
    });
  } catch (error) {
    next(error);
  }
};
