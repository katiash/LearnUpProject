//////////////////////////////////////////////////////////////////
//  SERVER/CONFIG/MONGOOSE.JS (DATABASE CONFIG FILE):
//////////////////////////////////////////////////////////////////
// Require Mongoose module in the following files:
// - HERE,
// - SCHEMA/MODEL file,
// - CONTROLLER file.
//////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "Dojo2017";

var users = require("./dummy_users");

// STEP 2 (DB/SCHEMA SETUP): Connect to Mongoose:
mongoose.connect("mongodb://localhost/learnup-db"); // <---- CHANGE DB NAME!

// [ FOR STEP 3 (DB/SCHEMA SETUP) => CREATE MODEL in './../MODELS/' ]
// [ FOR STEP 4 (DB/SCHEMA SETUP) => CREATE CONTROLLER FILE in './../CONTROLLERS/' and EXPORT CONTROLLER METHODS TO ROUTES.JS]

// Require the fs module for loading model files
var fs = require("fs");

// Require 'path' to retrieve models directory path:
var path = require("path");

// 'models_path' points to the path where all of the models live:
var models_path = path.join(__dirname, "./../models");
// (if not using 'path' module, use:
// var models_path = express.static(__dirname + './../models/' );

// Read all of the files within above 'models_path':
fs.readdirSync(models_path).forEach(function(file) {
  if (file.indexOf(".js") >= 0) {
    // Require each of the model.js files into current file:
    require(models_path + "/" + file);
  }

  var new_hash;
  bcrypt.hash(myPlaintextPassword, saltRounds);

  //FOR TESTING ONLY - ADD DEFAULT USER - REMOVE BEFORE ADDING TO PRODUCTION

  function addAccount(user) {
    bcrypt.hash(user.password, saltRounds).then(new_hash => {
      User.create({
        email: user.email,
        hash: new_hash,
        admin: user.admin
      }).then(result => console.log(result));
    });
  }

  function addDummyAccounts(users) {
    users.forEach(user => {
      addAccount(user);
    });
  }

  var User = mongoose.model("User");
  User.findOne({ email: "omar.ihmoda@gmail.com" }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      if (!result) {
        addDummyAccounts(users);
      }
    }
  });
});
