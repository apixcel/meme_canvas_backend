import { stripe } from "../app";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Authentication from "../models/auth.model";
import Plan from "../models/plan.model";
import Subscription from "../models/subscription.model";
import sendResponse from "../utils/sendResponse";

export const createSubscription = catchAsyncError(async (req, res) => {
  const { userId, planId, email, paymentMethodId } = req.body;

  const user = await Authentication.findById(userId);
  const plan = await Plan.findById(planId);

  if (!user || !plan) {
    console.log({ user, plan });

    return res.status(404).json({ message: "User or Plan not found" });
  }
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    user.stripeCustomerId = customer.id;
    await user.save();
  }
  const subscription = await stripe.subscriptions.create({
    customer: user.stripeCustomerId,
    items: [{ price: plan.stripePriceId as string }],
  });

  // Create a new Subscription document

  const newSubscription = await Subscription.findOneAndUpdate(
    { user: user._id },
    {
      plan: plan._id,
      stripeSubscriptionId: subscription.id,
      currentCredit: plan.credit,
    },
    { new: true }
  );

  // Update the user's subscription reference
  user.subscription = newSubscription?._id;
  await user.save();

  sendResponse(res, {
    message: "Subscription created successfully",
    data: newSubscription,
    success: true,
  });
});

export const upgradeSubscriptionPlan = catchAsyncError(async (req, res) => {
  const { userId, newPlanId } = req.body;

  // Find the user
  const user = await Authentication.findById(userId).populate("subscription");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Find the new plan
  const newPlan = await Plan.findById(newPlanId);

  if (!newPlan || !newPlanId.stripePriceId) {
    return res.status(404).json({ message: "Plan not found" });
  }

  // Get the current subscription
  const subscription = user.subscription as any;
  const subscriptionId = subscription.stripeSubscriptionId;

  // Update the subscription with the new plan
  const updatedSubscription = await stripe.subscriptions.update(
    subscriptionId,
    {
      items: [
        {
          id: subscription.stripeSubscriptionItemId, // This is the ID of the subscription item to update
          price: newPlan.stripePriceId!, // The price ID of the new plan
        },
      ],
      proration_behavior: "create_prorations", // Optional: Handle proration of charges
    }
  );

  // Update the user's subscription details in the database

  await Subscription.findByIdAndUpdate(user._id, { plan: newPlan._id });
});
