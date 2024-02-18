import express from "express";
import {
  getRatingsByServiceProvider,
  getRatingsByServiceProvider_inorder,
} from "../controller/ratingController.js";

const route = express.Router();

route.get("/service-providers/:serviceProviderId", getRatingsByServiceProvider);
route.get(
  "/service-providers_inorder/:serviceProviderId",
  getRatingsByServiceProvider_inorder
);

export default route;
