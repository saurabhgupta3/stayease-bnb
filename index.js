const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

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

app.listen("8080", () => {
    console.log("server is listening on port 8080");
});

//root route
app.get("/", (req, res) => {
    res.send("root is working");
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
