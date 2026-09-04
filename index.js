if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const apiRouter = require("./routes/api.js");

//logging middleware

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

//The React build in ./frontend/dist is the frontend. /public stays mounted so
//image paths saved on older listings (e.g. /images/default.jpg) keep resolving.
const clientDist = path.join(__dirname, "frontend", "dist");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(clientDist));

if (!fs.existsSync(path.join(clientDist, "index.html"))) {
    console.log(
        "frontend/dist not found - run `npm run build` so the React app can be served"
    );
}

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (error) => {
    console.log("error in mongo session store", error);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "saurabhgupta3",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

//JSON API consumed by the React frontend
app.use("/api", apiRouter);

//Every other GET hands the page to React, which does its own routing.
//Unmatched /api paths are answered by the API router's own 404.
app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
        return next(new ExpressError(404, "Not found"));
    }
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
        if (err) {
            next(
                new ExpressError(
                    500,
                    "React build not found - run `npm run build` first"
                )
            );
        }
    });
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "some error occured" } = err;
    res.status(statusCode).json({ error: message });
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
