var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var config = require("./config/database");
var bodyParser = require("body-parser");
var session = require("express-session");
var expressValidator = require("express-validator");
var fileUpload = require("express-fileupload");

// Connect to db
mongoose.connect(config.database);
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  console.log("Conected to database");
});

// Initial
var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Setup Global errors variable
app.locals.errors = null;

// Express fileUpload middleware
app.use(fileUpload());

// Setup body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Setup express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
    //cookie: { secure: true }
  })
);

// Setup express validator middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Setup express messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// set routes
var pages = require("./routes/pages.js");
var adminPages = require("./routes/admin_pages.js");
var adminCategories = require("./routes/admin_categories.js");
var adminProducts = require("./routes/admin_products.js");

// setup links
app.use("/admin/pages", adminPages);
app.use("/admin/categories", adminCategories);
app.use("/admin/products", adminProducts);
app.use("/", pages);

// Setup server
var port = 5000;
app.listen(port, function() {
  console.log("Server running on port " + port);
});