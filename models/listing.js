const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: "C:/Users/saurabh/OneDrive/Pictures/Default.jpg",
            set: (v) =>
                v === "" ? "C:/Users/saurabh/OneDrive/Pictures/Default.jpg" : v,
        },
    },
    location: {
        type: String,
    },
    price: {
        type: Number,
    },
    country: {
        type: String,
    },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
