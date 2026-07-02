const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;
const Review = require("./review");
const Listing = require("./listing");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

userSchema.plugin(passportLocalMongoose);

userSchema.post("findOneAndDelete", async (user) => {
    if (!user) return;

    // Find all reviews written by the user
    const reviews = await Review.find({ author: user._id });
    const reviewIds = reviews.map(review => review._id);

    // Remove review ids from all listings
    await Listing.updateMany({}, {
        $pull: {reviews: 
            { $in: reviewIds}
        }
    });

    // Delete all reviews written by user
    await Review.deleteMany({ author: user._id });

    // Delete all listings created by user
    const listings = await Listing.find({ owner: user._id });

    for (let listing of listings) {
        await Listing.findByIdAndDelete(listing._id);
    }
});

module.exports = mongoose.model("User", userSchema);