import express from "express";
import {
  createReview,
  getReviewsByServiceProvider,
  getReviewsByServiceProviderAndUser,
} from "../controller/reviewController.js";

const route = express.Router();

route.post("/create", createReview);
route.get("/service-providers/:serviceProviderId", getReviewsByServiceProvider);
route.get(
  "/:serviceProviderId/reviews/:userId",
  getReviewsByServiceProviderAndUser
);

export default route;
