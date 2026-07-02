const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require("dotenv").config({ path: "../.env" });

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN,
});

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

const initDB = async () => {
    await Listing.deleteMany({});

    for (let obj of initData.data) {
        let response = await geocodingClient
            .forwardGeocode({
                query: obj.location,
                limit: 1,
            })
            .send();

        obj.owner = "6a36282a43df08a0208e382f";
        obj.geometry = response.body.features[0].geometry;
    }

    await Listing.insertMany(initData.data);

    console.log("data was initialised");
};

initDB();