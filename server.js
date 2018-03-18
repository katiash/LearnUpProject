// ////////////////////////////////////////////////
// LEARN_UP/SERVER.JS FILE:
// ////////////////////////////////////////////////

// REQUIRE EXPRESS & SESSION MODULES:
// ==================================
// Require 'session' Module (prior to invoking Express):
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Require flash messaging
const flash = require('connect-flash');
// Require the 'express' Module - to handle requests:
const express = require('express');
// Create an express application:
// i.e. invoke 'express' Module and send it to 'app' variable:
const app = express();

// Tell express 'app' to use cookie-parser
app.use(cookieParser());

// Tell express 'app' to use 'session', and
// give 'session' a dummy string for encryption:
app.use(session({ secret: 'codingdojorocks' }));
app.use(flash());

// BODYPARSER MODULE CONFIGS:
// ===========================
// Require 'body-parser' Module - to receive post data from clients:
const bodyParser = require('body-parser');

// Tell express 'app' to use bodyParser:

app.use(bodyParser.urlencoded({ extended: true }));
// This notation allows for parsing of key-value pairs, where the value can be a string or array
// (when extended is false), or any type (when extended is true).
// The "extended" syntax allows for rich objects
// and arrays to be encoded into the URL-encoded format,
// allowing for a JSON-like experience with URL-encoded.
// https://github.com/expressjs/body-parser for more info on "bodyParser.urlencoded([options]).

app.use(bodyParser.json());
// This notation allows for parsing of JSON objects.
// ====================================================

// Require 'path' Module:
// (provides utilities for working with file and directory paths)
const path = require('path');

// Require Mongoose Module (prior to routes section,  after 'app' variable definition).
// Connects express 'app' to mongodb (Mongo database):

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Require Mongoose Configuration file:
require('./server/config/mongoose.js');

// SET STATIC & VIEWS DIRECTORIES:
// =====================================
// Set View Engine to EJS:
app.set('view engine', 'ejs');

// Set Static Folder Directory (w/ front-end Angular):
// app.use(express.static(__dirname + '/public/dist/' ));
// -> front-end application directory name has to match above (i.e. "public")

// Set Static Folder Directory (w/o front-end):
app.use(express.static(path.join(__dirname, './static')));

// Set Views Folder Directory:
app.set('views', path.join(__dirname, './views'));
// '__dirname' holds this path: C:\<your_local_project_directory_path>

// ROUTES:
// =======================================
// Require a routes.js file for server.js
const routesSetter = require('./server/config/routes.js');
// Invoke routes.js:
routesSetter(app);

// ////////////////////////////////////////////
// Start Node 'server' listening on port 8000:
// ////////////////////////////////////////////
const server = app.listen(8000, () => {
  console.log('Listening to port 8000');
});

// Server SOCKET.IO Setup:
// ==============================================
// Require 'socket.io' Module & tell it to listen to 'server':
const io = require('socket.io').listen(server);
// Returns an "io" object to control sockets!

// SETUP a 'connection' EVENT to listen to any client that connects to our server socket:
io.sockets.on('connection', (socket) => {
  console.log('Client/socket is connected!');
  console.log('Client/socket id is: ', socket.id);
  // all the server socket code goes in here ...

  socket.on('button_clicked', (data) => {
    // Display 'data' object received in server console / terminal:
    console.log(`Someone clicked a button! Reason: ${data.reason}`);
    // Respond to client: emit another event and send a 'response' data object back to client:
    socket.emit('server_response', { response: 'sockets are the best!' });
  });

  socket.on('create', (room) => {
    console.log('joined room');
    socket.join(room);
    io.to(room).emit('user_joined', { response: `user joined room ${room}` });
  });

  socket.on('join room', (room) => {
    console.log('joined room');
    socket.join(room);
    io.to(room).emit('user_joined', { response: `user joined room ${room}` });
  });

  socket.on('tile_clicked', (data) => {
    socket.broadcast.to(data.room).emit('server_response', { response: data });
  });

  socket.on('finished_drag', (data) => {
    socket.broadcast.to(data.room).emit('deselect', { response: data });
  });

  socket.on('reset', (data) => {
    socket.broadcast.to(data.room).emit('reset_tiles');
  });
});
