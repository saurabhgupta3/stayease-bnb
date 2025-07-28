const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//index route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        // console.log(allListings);
        res.render("listings/index", { allListings });
    })
);

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

//show route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const list = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        // console.log(list);
        if (!list) {
            req.flash("error", "Sorry! that listing does not exists");
            return res.redirect("/listings");
        }
        console.log(list);
        res.render("listings/show", { list });
    })
);

//create route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
        const { title, description, location, price, country, image } =
            req.body;

        const newListing = new Listing({
            title,
            description,
            location,
            price,
            country,
            image,
        });
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "new listing created");
        res.redirect("/listings");
    })
);

//edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        console.log(id);
        const list = await Listing.findById(id);
        if (!list) {
            req.flash("error", "Sorry! that listing does not exists");
            return res.redirect("/listings");
        }
        res.render("listings/edit", { list });
    })
);

//update route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const { title, description, location, price, country, image } =
            req.body;
        await Listing.findByIdAndUpdate(id, {
            title,
            description,
            location,
            price,
            country,
            image,
        });
        req.flash("success", "listing updated");
        res.redirect(`/listings/${id}`);
    })
);

//delete route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "listing deleted");
        res.redirect("/listings");
    })
);

module.exports = router;
