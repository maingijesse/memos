const express = require("express");
const exhbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
//load routes

const memos = require("./routes/memos");
const users = require("./routes/users");

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

//user routes
app.use("/memos", memos);
app.use("/users", users);

const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
