//////////////////////////////////////////////////
// LEARN_UP/SERVER.JS FILE:
//////////////////////////////////////////////////

// REQUIRE EXPRESS & SESSION MODULES:
// ==================================
// Require 'session' Module (prior to invoking Express):
var session = require("express-session");
var cookieParser = require("cookie-parser");

//Require flash messaging
var flash = require("connect-flash");
// Require the 'express' Module - to handle requests:
var express = require("express");
// Create an express application:
// i.e. invoke 'express' Module and send it to 'app' variable:
var app = express();

//Tell express 'app' to use cookie-parser
app.use(cookieParser());

// Tell express 'app' to use 'session', and
// give 'session' a dummy string for encryption:
app.use(session({ secret: "codingdojorocks" }));
app.use(flash());

// BODYPARSER MODULE CONFIGS:
// ===========================
// Require 'body-parser' Module - to receive post data from clients:
var bodyParser = require("body-parser");

// Tell express 'app' to use bodyParser:

app.use(bodyParser.urlencoded({ extended: true }));
// This notation allows for parsing of key-value pairs, where the value can be a string or array
// (when extended is false), or any type (when extended is true).
// The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format,
// allowing for a JSON-like experience with URL-encoded.
// https://github.com/expressjs/body-parser for more info on "bodyParser.urlencoded([options]).

app.use(bodyParser.json());
// This notation allows for parsing of JSON objects.
// ====================================================

// Require 'path' Module:
// (provides utilities for working with file and directory paths)
var path = require("path");

// Require Mongoose Module (prior to routes section,  after 'app' variable definition).
// Connects express 'app' to mongodb (Mongo database):

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// Require Mongoose Configuration file:
require("./server/config/mongoose.js");

// SET STATIC & VIEWS DIRECTORIES:
// =====================================
// Set View Engine to EJS:
app.set("view engine", "ejs");

// Set Static Folder Directory (w/ front-end Angular):
// app.use(express.static(__dirname + '/public/dist/' ));
// -> front-end application directory name has to match above (i.e. "public")

// Set Static Folder Directory (w/o front-end):
app.use(express.static(path.join(__dirname, "./static")));

// Set Views Folder Directory:
app.set("views", path.join(__dirname, "./views"));
// '__dirname' holds this path: C:\<your_local_project_directory_path>

// ROUTES:
// =======================================
// Require a routes.js file for server.js
var routes_setter = require("./server/config/routes.js");
// Invoke routes.js:
routes_setter(app);

//////////////////////////////////////////////
// Start Node 'server' listening on port 8000:
//////////////////////////////////////////////
var server = app.listen(8000, function() {
  console.log("Listening to port 8000");
});

// Server SOCKET.IO Setup:
// ==============================================
// Require 'socket.io' Module & tell it to listen to 'server':
var io = require("socket.io").listen(server);
// Returns an "io" object to control sockets!

// SETUP a 'connection' EVENT to listen to any client that connects to our server socket:
io.sockets.on("connection", function(socket) {
  console.log("Client/socket is connected!");
  console.log("Client/socket id is: ", socket.id);
  // all the server socket code goes in here ...

  socket.on("button_clicked", function(data) {
    //Display 'data' object received in server console / terminal:
    console.log("Someone clicked a button! Reason: " + data.reason);
    //Respond to client: emit another event and send a 'response' data object back to client:
    socket.emit("server_response", { response: "sockets are the best!" });
  });
});

////////////////////////////////
// ANGULAR SETUP ADDIONAL STEPS:
// =============================
// 1. RUN: ng new public (this creates Angular app in "public" folder)
// THIS creates our angular-app in "public" directory, and the package.json with Angular dependencies (node-modules folder).
// 2. cd INTO "public" DIRECTORY AND RUN:
// a) npm install --save @angular-devkit/core
// b) npm install
// c) ng build --watch
// THIS creates our dist folder and starts Angular (Angular watches for any changes in "dist" folder!)
// 3. WITHIN "public" now RUN: ng g s http
// THIS creates our http.service.ts.
// IF GET SOME ANGULAR ERROR HERE: TRY THIS:
// npm install --save-dev @angular/cli@latest
// npm install -g @angular/cli@latest
// 4. WITHIN ..app/app.module.ts ADD THE FOLLWING:
// import { HttpService } from './http.service';
// import { HttpClientModule } from '@angular/common/http';
// 5. TO GENERATE COMPONENT: ng g c component_name
