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
        initData.data =  initData.data.map((obj) => ({...obj, owner: "688760ab69eb2bffcd5f9d2e"}));
        await Listing.insertMany(initData.data);
        console.log("database initialised successfully");
    } catch (err) {
        console.log("error in database", err);
    }
};

initDB();