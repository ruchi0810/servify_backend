import Review from "../model/reviewModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import { io } from "../index.js";
import User from "../model/userModel.js";

export const createReview = async (req, res) => {
  try {
    const reviewData = new Review(req.body);
    const savedData = await reviewData.save();
    io.emit("newReview", savedData);
    console.log("Emitted newReview event");
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsByServiceProvider = async (req, res) => {
  try {
    const serviceProviderId = req.params.serviceProviderId;

    // Ensure that the service provider exists
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ msg: "Service provider not found" });
    }

    // Retrieve reviews for the specified service provider
    // const reviews = await Review.find({ serviceProviderId }).populate("userId");
    const reviews = await Review.find({ serviceProviderId }).populate({
      path: "userId",
      select: "name mobile",
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET localhost:8000/api/reviews/service-providers/SP_ID


export const getReviewsByServiceProviderAndUser = async (req, res) => {
  try {
    const { serviceProviderId, userId } = req.params;

    // Ensure that the service provider and user exist
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    const user = await User.findById(userId);

    if (!serviceProvider || !user) {
      return res
        .status(404)
        .json({ msg: "Service provider or user not found" });
    }

    // Retrieve reviews for the specified service provider
    const reviews = await Review.find({ serviceProviderId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .populate({
        path: "userId",
        select: "name mobile",
      });

    // Separate reviews by the specified user and other users
    const userReviews = [];
    const otherUserReviews = [];

    reviews.forEach((review) => {
      if (review.userId._id.toString() === userId) {
        userReviews.unshift(review); // Add user's reviews to the beginning of the array
      } else {
        otherUserReviews.push(review); // Add other users' reviews to the end of the array
      }
    });

    // Combine user reviews and other user reviews
    const combinedReviews = userReviews.concat(otherUserReviews);

    res.status(200).json(combinedReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//GET http://localhost:8000/api/reviews/SP_ID/reviews/USER_ID
