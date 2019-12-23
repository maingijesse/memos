const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//user login
router.get("/login", (req, res) => {
  res.send("successfully logged in");
});

//user register
router.get("/register", (req, res) => {
  res.send("Register");
});

module.exports = router;
