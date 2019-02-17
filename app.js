var express = require("express");
var path = require("path");
var config = require("./config/database");
var mongoose = require("mongoose");

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

app.get('/', function (req, res) {
    res.send('hello world')
  })

//setup server
var port = 5000;
app.listen(port, function(){
    console.log("Server sukses listen to " + port);
});