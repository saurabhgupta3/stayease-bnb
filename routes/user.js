const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post(
    "/signup",
    wrapAsync(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({ username, email, password });
            const registerdUser = await User.register(newUser, password);
            console.log(registerdUser);
            req.login(registerdUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to stayease-bnb");
                res.redirect("/listings");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "welcome back to stayease-bnb");
        const url = res.locals.redirectUrl || "/listings";
        res.redirect(url);
    }
);

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged Out now!");
        res.redirect("/listings");
    });
});

module.exports = router;
