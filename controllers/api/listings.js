const Listing = require("../../models/listing.js");
const ExpressError = require("../../utils/ExpressError.js");

// Never populate a User without selecting fields — the schema carries hash + salt.
const OWNER_FIELDS = "username email";

module.exports.index = async (req, res) => {
    const listings = await Listing.find({}).populate("owner", OWNER_FIELDS);
    res.json({ listings });
};

module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", select: OWNER_FIELDS } })
        .populate("owner", OWNER_FIELDS);
    if (!listing) {
        return next(new ExpressError(404, "Sorry! that listing does not exist"));
    }
    res.json({ listing });
};

module.exports.createListing = async (req, res, next) => {
    const { title, description, location, price, country, latitude, longitude } = req.body;

    if (!req.file) {
        return next(new ExpressError(400, "A listing image is required"));
    }
    if (!latitude || !longitude) {
        return next(new ExpressError(400, "Invalid location provided"));
    }

    const newListing = new Listing({
        title,
        description,
        location,
        price,
        country,
        image: { url: req.file.path, filename: req.file.filename },
        owner: req.user._id,
        geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
    });

    await newListing.save();
    res.status(201).json({ listing: newListing, message: "New listing created" });
};

module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, location, price, country, latitude, longitude } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Sorry! that listing does not exist"));
    }

    Object.assign(listing, { title, description, location, price, country });

    // The EJS edit form never re-geocoded, so moving a listing left the map stale.
    // The React edit form sends fresh coordinates whenever the location changes.
    if (latitude && longitude) {
        listing.geometry = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
    }

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save();
    res.json({ listing, message: "Listing updated" });
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({ message: "Listing deleted" });
};
