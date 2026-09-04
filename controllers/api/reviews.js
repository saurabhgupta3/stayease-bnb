const Listing = require("../../models/listing.js");
const Review = require("../../models/review.js");
const ExpressError = require("../../utils/ExpressError.js");

module.exports.createReview = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(new ExpressError(404, "Sorry! that listing does not exist"));
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.createdAt = Date.now();
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    await newReview.populate("author", "username email");
    res.status(201).json({ review: newReview, message: "New review created" });
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Review deleted" });
};
