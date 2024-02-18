import Rating from "../model/ratingModel.js";
import ServiceProvider from "../model/serviceProviderModel.js";
import { io } from "../index.js";

export const createRating = async (req, res) => {
  try {
    const ratingData = new Rating(req.body);
    const savedData = await ratingData.save();
    io.emit("newRating", savedData);
    console.log("Emitted newRating event");
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatingsByServiceProvider = async (req, res) => {
  try {
    const serviceProviderId = req.params.serviceProviderId;

    // Ensure that the service provider exists
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ msg: "Service provider not found" });
    }

    const ratings = await Rating.find({ serviceProviderId }).populate({
      path: "userId",
      select: "name mobile",
    });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//localhost:8000/api/ratings/service-providers/SP_ID

export const getRatingsByServiceProvider_inorder = async (req, res) => {
  try {
    const serviceProviderId = req.params.serviceProviderId;

    // Ensure that the service provider exists
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ msg: "Service provider not found" });
    }

    const ratings = await Rating.find({ serviceProviderId })
      .populate({
        path: "userId",
        select: "name mobile",
      })
      .sort({ rating: -1 }); // Sorting by createdAt in descending order

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//localhost:8000/api/ratings/service-providers_inorder/SP_ID
