const Listing = require("../models/listing.js");

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
    console.log(list);
    res.render("listings/show", { list });
};

module.exports.createListing = async (req, res, next) => {
    const { title, description, location, price, country, image } = req.body;

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
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Sorry! that listing does not exists");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { list });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, price, country, image } = req.body;
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
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};
