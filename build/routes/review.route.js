"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const router = (0, express_1.Router)();
// Create a review
router.post("/reviews", review_controller_1.publishReview);
// Read all reviews
router.get("/reviews", review_controller_1.getAllReviews);
// Read a review by ID
router.get("/reviews/:id", review_controller_1.getSingleReview);
// Update a review by ID
router.patch("/reviews/:id", review_controller_1.updateSingleReview);
// Delete a review by ID
router.delete("/reviews/:id", review_controller_1.deleteSingleReview);
exports.default = router;
