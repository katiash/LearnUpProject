// ////////////////////////////////////////////////////////////////
//  SERVER/CONFIG/MONGOOSE.JS (DATABASE CONFIG FILE):
// ////////////////////////////////////////////////////////////////
// Require Mongoose module in the following files:
// - HERE,
// - SCHEMA/MODEL file,
// - CONTROLLER file.
// ////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 'Dojo2017';

const users = require('./dummy_users');

// STEP 2 (DB/SCHEMA SETUP): Connect to Mongoose:
mongoose.connect('mongodb://localhost/learnup-db'); // <---- CHANGE DB NAME!

// [ FOR STEP 3 (DB/SCHEMA SETUP) => CREATE MODEL in './../MODELS/' ]
// [ FOR STEP 4 (DB/SCHEMA SETUP) => CREATE CONTROLLER FILE in
// './../CONTROLLERS/' and EXPORT CONTROLLER METHODS TO ROUTES.JS]

// Require the fs module for loading model files
const fs = require('fs');

// Require 'path' to retrieve models directory path:
const path = require('path');

// 'modelsPath' points to the path where all of the models live:
const modelsPath = path.join(__dirname, './../models');
// (if not using 'path' module, use:
// var modelsPath = express.static(__dirname + './../models/' );

// Read all of the files within above 'modelsPath':
fs.readdirSync(modelsPath).forEach((file) => {
  if (file.indexOf('.js') >= 0) {
    // Require each of the model.js files into current file:
    require(`${modelsPath}/${file}`);
  }

  const User = mongoose.model('User');

  bcrypt.hash(myPlaintextPassword, saltRounds);

  // FOR TESTING ONLY - ADD DEFAULT USER - REMOVE BEFORE ADDING TO PRODUCTION

  function addAccount(user) {
    bcrypt.hash(user.password, saltRounds).then((hash) => {
      User.create({
        email: user.email,
        hash,
        admin: user.admin,
      }).then(result => console.log(result));
    });
  }

  function addDummyAccounts(dummyUsers) {
    dummyUsers.forEach((user) => {
      addAccount(user);
    });
  }

  User.findOne({ email: 'omar.ihmoda@gmail.com' }, (error, result) => {
    if (error) {
      console.log(error);
    } else if (!result) {
      addDummyAccounts(users);
    }
  });
});
