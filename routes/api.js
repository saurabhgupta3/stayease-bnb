// JSON API consumed by the React frontend in ./frontend.
// Additive: the EJS routes in listings.js / review.js / user.js are untouched.
const express = require("express");
const multer = require("multer");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { storage } = require("../cloudConfig.js");
const {
    isLoggedIn,
    isOwner,
    isReviewAuthor,
    validateListing,
    validateReview,
} = require("../apiMiddleware.js");

const listingController = require("../controllers/api/listings.js");
const reviewController = require("../controllers/api/reviews.js");
const userController = require("../controllers/api/users.js");

const router = express.Router();
const upload = multer({ storage });

// Scoped to this router so the EJS side keeps its urlencoded-only body parsing.
router.use(express.json());

/* ---------------------------------- auth ---------------------------------- */
router.get("/me", userController.me);
router.post("/signup", wrapAsync(userController.signup));
router.post("/login", userController.login);
router.post("/logout", userController.logout);

/* -------------------------------- listings -------------------------------- */
router
    .route("/listings")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router
    .route("/listings/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        wrapAsync(isOwner),
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, wrapAsync(isOwner), wrapAsync(listingController.destroyListing));

/* --------------------------------- reviews -------------------------------- */
router.post(
    "/listings/:id/reviews",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

router.delete(
    "/listings/:id/reviews/:reviewId",
    isLoggedIn,
    wrapAsync(isReviewAuthor),
    wrapAsync(reviewController.destroyReview)
);

/* ------------------------- 404 + JSON error handler ------------------------ */
router.use((req, res, next) => {
    next(new ExpressError(404, "API route not found"));
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    if (err.name === "CastError") {
        return res.status(404).json({ error: "Sorry! that listing does not exist" });
    }
    const { statusCode = 500, message = "some error occured" } = err;
    res.status(statusCode).json({ error: message });
});

module.exports = router;
