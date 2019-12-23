const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// load memo model
require("../models/Memo");
const Memo = mongoose.model("memos");

//get memos
router.get("/", (req, res) => {
  Memo.find({})
    .sort({ date: "desc" })
    .then(memos => {
      res.render("memos/index", {
        memos: memos
      });
    });
});

//adding memos
router.get("/add", (req, res) => {
  res.render("memos/add");
});

//edit memo route
router.get("/edit/:id", (req, res) => {
  Memo.findOne({
    _id: req.params.id
  }).then(memo => {
    res.render("memos/edit", {
      memo: memo
    });
  });
});
//edit memo in database action
router.put("/:id", (req, res) => {
  Memo.findOne({
    _id: req.params.id
  }).then(memo => {
    memo.title = req.body.title;
    memo.details = req.body.details;
    memo.save().then(memo => {
      req.flash("success_msg", "Memo updated");
      res.redirect("/memos");
    });
  });
});

//handle forms
router.post("/", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }
  if (errors.length > 0) {
    res.render("memos/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Memo(newUser)
      .save()
      .then(memo => {
        req.flash("success_msg", "New memo added");

        res.redirect("/memos");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

//delete memo
router.delete("/:id", (req, res) => {
  Memo.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Memo successfully deleted");
    res.redirect("/memos");
  });
});

module.exports = router;
