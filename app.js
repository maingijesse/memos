const express = require("express");
const exhbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// establishing a db connection
mongoose
  .connect("mongodb://localhost/memos", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connection established");
  })
  .catch(err => {
    console.log(err);
  });

// load memo model
require("./models/Memo");
const Memo = mongoose.model("memos");

//static files
app.use(express.static("public"));

//middlewares
//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//method override
app.use(methodOverride("_method"));
//session middleware
app.use(
  session({
    secret: "kaskllkncns  bsusdwuqwo77845",
    resave: true,
    saveUninitialized: true
  })
);

//flash middleware
app.use(flash());
//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
//hbs middleware
app.engine("handlebars", exhbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//get home directory
app.get("/", (req, res) => {
  const title = "Welcome to MEMOS";
  res.render("index", {
    title
  });
});
//get about
app.get("/about", (req, res) => {
  res.render("about");
});

//get memos
app.get("/memos", (req, res) => {
  Memo.find({})
    .sort({ date: "desc" })
    .then(memos => {
      res.render("memos/index", {
        memos: memos
      });
    });
});

//adding memos
app.get("/memos/add", (req, res) => {
  res.render("memos/add");
});

//edit memo route
app.get("/memos/edit/:id", (req, res) => {
  Memo.findOne({
    _id: req.params.id
  }).then(memo => {
    res.render("memos/edit", {
      memo: memo
    });
  });
});
//edit memo in database action
app.put("/memos/:id", (req, res) => {
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
app.post("/memos", (req, res) => {
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
app.delete("/memos/:id", (req, res) => {
  Memo.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Memo successfully deleted");
    res.redirect("/memos");
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
