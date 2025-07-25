const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

//logging middleware

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/stayease-bnb";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else next();
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else next();
};

//root route
app.get("/", (req, res) => {
    res.send("root is working");
});

//index route
app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        // console.log(allListings);
        res.render("listings/index", { allListings });
    })
);

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

//show route
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const list = await Listing.findById(id).populate("reviews");
        // console.log(list);
        res.render("listings/show", { list });
    })
);

//create route
app.post(
    "/listings",
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
app.get(
    "/listings/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        console.log(id);
        const list = await Listing.findById(id);
        res.render("listings/edit", { list });
    })
);

//update route
app.put(
    "/listings/:id",
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
app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    })
);

//reviews
//post review request
app.post(
    "/listings/:id/reviews",
    validateReview,
    wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        console.log(req.body);
        let newReview = new Review(req.body.review);
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("review saved");
        res.redirect(`/listings/${listing._id}`);
    })
);

//delete review request

app.delete(
    "/listings/:id/reviews/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "some error occured" } = err;
    res.status(statusCode).render("error", { message });
    // res.status(statusCode).send(message);
});

app.listen("8080", () => {
    console.log("server is listening on port 8080");
});

//test route
// app.get("/test", (req, res) => {
//     let sampleListing = new Listing({
//         title: "my home",
//         description: "nice home",
//         price: 400000,
//         location: "swaruppur",
//         country: "India",
//     });
//     sampleListing
//         .save()
//         .then(() => {
//             console.log("data is saved");
//         })
//         .catch((err) => {
//             console.log(err);
//         });
//     res.send("successful");
// });
