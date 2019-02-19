var express = require("express");
var path = require("path");
var config = require("./config/database");
var mongoose = require("mongoose");
var expressValidator = require("express-validator");

//connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on("error", console.error.bind (console, "connection error:"));
db.once("open", function() {
  // we're connected
  console.log("Conected to database");
});

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

//set routes
var pages = require("./routes/pages.js");
var adminPages = require("./routes/admin_pages.js");

//express validator
app.use(ExpressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split("."),
    root = namespace.shift(),
    formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
        msg: msg,
        value: value
    };
  }
}))

//connect flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//redirection
app.use("/", pages);
app.use("/admin/pages", adminPages);

//setup server
var port = 5000;
app.listen(port, function(){
    console.log("Server sukses listen to " + port);
});