var express = require("express");
var path = require("path");

var app = express();
//setup server
var port = 3000;
app.listen(port, function(){
    console.log("Server sukses listen to " + port);
});