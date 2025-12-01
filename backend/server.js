// Import and configure the 'dotenv' package at the top of server.js to load environment variables.
require("dotenv").config();

const express = require("express");
const connectDB = require("./shared/middlewares/connect-db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { productsRoute } = require("./modules/products/products-routes");
const { accountsRoute } = require("./modules/account/account-routes");
const { cartsRoute } = require("./modules/carts/carts-routes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const port = 3000;
const hostname = "localhost";

const server = express();

server.use(cors({ credentials: true }));

// built-in middlewares to parse request body in application-level
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// middlewares to parse cookies in application-level
server.use(cookieParser());

// Session middleware
server.use(
  session({
    secret: process.env.SESSION_SECRET, // for signing session ID
    resave: false, // avoid saving unmodified session
    saveUninitialized: false, // only save sessions if something is stored
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      dbName: process.env.DB_NAME,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true, // not accessible via JS
      secure: false, // true if using HTTPS
    },
  })
);

// middleware to configure passport js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/accounts/login/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// Add the connectDB middleware in application-level, before defining routes.
server.use(connectDB);

// Mount all the routes
server.use(productsRoute);
server.use(accountsRoute);
server.use(cartsRoute);

// error-handling middleware to logs the error for debugging.
server.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("Oops! Internal server error!");
});

// Middleware to handle route not found error.
server.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running on http://${hostname}:${port}`);
});
