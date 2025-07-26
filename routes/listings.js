const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else next();
};

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
router.get("/new", (req, res) => {
    res.render("listings/new");
});

//show route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const list = await Listing.findById(id).populate("reviews");
        // console.log(list);
        res.render("listings/show", { list });
    })
);

//create route
router.post(
    "/",
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
        await newListing.save();
        res.redirect("/listings");
    })
);

//edit route
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        console.log(id);
        const list = await Listing.findById(id);
        res.render("listings/edit", { list });
    })
);

//update route
router.put(
    "/:id",
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
        res.redirect(`/listings/${id}`);
    })
);

//delete route
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    })
);

module.exports = router;
