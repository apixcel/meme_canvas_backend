"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = require("../controllers/subscription.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/create", auth_1.isAuthenticatedUser, subscription_controller_1.createSubscription);
const subscriptionRoute = router;
exports.default = subscriptionRoute;
