"use strict";

const jwt = require("jsonwebtoken");
require('dotenv').config();

const bearerAuth = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ").pop();
    if (!token) {
        return res.status(403).send("No token provided");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.profileId = decoded.profileId;
      } catch (err) {
        console.log("JWT Verify Error: ", err);
        return res.status(403).send("Invalid token");
      }
      return next();
};

module.exports = bearerAuth;