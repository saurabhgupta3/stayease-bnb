const passport = require("passport");
const User = require("../../models/user.js");
const ExpressError = require("../../utils/ExpressError.js");

// Only ever hand the client these fields — the User doc also holds hash + salt.
const publicUser = (user) =>
    user ? { _id: user._id, username: user.username, email: user.email } : null;

module.exports.me = (req, res) => {
    res.json({ user: publicUser(req.user) });
};

module.exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return next(new ExpressError(400, "Username, email and password are required"));
    }

    try {
        const registeredUser = await User.register(new User({ username, email }), password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.status(201).json({
                user: publicUser(registeredUser),
                message: "Welcome to stayease-bnb",
            });
        });
    } catch (e) {
        next(new ExpressError(400, e.message));
    }
};

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return next(new ExpressError(401, (info && info.message) || "Invalid credentials"));
        }
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            res.json({ user: publicUser(user), message: "Welcome back to stayease-bnb" });
        });
    })(req, res, next);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        res.json({ message: "You are logged out now!" });
    });
};
