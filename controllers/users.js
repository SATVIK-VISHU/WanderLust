const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash("success", "welcome to WanderLust");
            res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "you have logged out!");
        res.redirect("/listings");
    });
};

module.exports.deleteAccount = async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);
    req.logout(function(err){

        if(err) return next(err);

        req.flash("success", "Your account has been deleted successfully.");
        res.redirect("/listings");
    });
};

module.exports.renderProfile = async (req, res) => {
    const listingsCount = await Listing.countDocuments({ owner: req.user._id });
    const reviewsCount = await Review.countDocuments({ author: req.user._id });
    res.render("users/profile", { listingsCount, reviewsCount });
};