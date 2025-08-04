const Listing = require("../models/listing.js");
// const getCoordinates = require("../utils/geoCode.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    // console.log(list);
    if (!list) {
        req.flash("error", "Sorry! that listing does not exists");
        return res.redirect("/listings");
    }
    res.render("listings/show", { list });
};

module.exports.createListing = async (req, res, next) => {
    console.log(req.body);
    const {
        title,
        description,
        location,
        price,
        country,
        latitude,
        longitude,
    } = req.body;
    const { path: url, filename } = req.file;

    if (!latitude || !longitude) {
        req.flash("error", "Invalid location provided");
        return res.redirect("/listings/new");
    }

    const newListing = new Listing({
        title,
        description,
        location,
        price,
        country,
        image: { url, filename },
        owner: req.user._id,
        geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
    });

    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Sorry! that listing does not exists");
        return res.redirect("/listings");
    }
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit", { list, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, price, country, image } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(id, {
        title,
        description,
        location,
        price,
        country,
        image,
    });
    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};
