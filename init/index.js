const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/stayease-bnb";
const Listing = require("../models/listing.js");
const initData = require("./data.js");

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        console.log("all data cleared");
        await Listing.insertMany(initData.data);
        console.log("database initialised successfully");
    } catch (err) {
        console.log("error in database", err);
    }
};

initDB();