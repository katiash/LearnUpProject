////////////////////////////////////////////////////////////////////////////////////////
//  SERVER/CONTROLLERS/CONTROLLER_NAME_PLURAL.JS FILE (CONTROLLER for a MODEL ):
/////////////////////////////////////////////////////////////////////////////////////////
// Require Mongoose module in the following files:
// - mongoose.js file,
// - HERE,
// - SCHEMA/MODEL file.
/////////////////////////////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

// STEP 4 (DB/SCHEMA SETUP): Declare/define controller on model & export to routes.js:
//////////////////////////////////////////////////////////////////////////////////////////
//  Retrieve a defined schema from mongoose models:
// 'User' variable object comforms to a model_instance retrieved from mongoose models.
var User = mongoose.model("User");

module.exports = {
  // EXAMPLE OF A CRUD get REQUEST method:
  get: function(request, response) {
    User.findOne({}, function(err, result) {
      if (err) {
        console.log("Something went wrong");
        response.json({ message: "error!", error: err }); // <-- CHANGED THIS FOR BOILER (FROM LECTURE NOTES)
      } else {
        if (!result) {
          var instance = new User({ gold: 0 }); // <-- CREATE NEW DOCUMENT (RECORD aka INSTANCE) IN DB
          instance.save(); // < -- SAVE IT!
          response.json(instance);
        } else {
          response.json({ message: "Success", data: result }); // CHANGED THIS FOR BOILER (FROM LECTURE NOTES)
        }
      }
    });
  },
  login: function(request, response) {
    User.findOne({ email: request.body.email })
      .then(result => {
        bcrypt.compare(request.body.password, result.hash).then(res => {
          if (res) {
            request.session["user"] = request.body.email;
            response.redirect("/admin/dashboard");
          }
          request.flash("error", "Incorrect password or username");
          response.redirect("/admin");
        });
      })
      .catch(error => {
        request.flash("error", "Incorrect password or username");
        response.redirect("/admin");
      });
  } // <--- ADD ADDITIONAL METHODS SEPARATED BY A COMMA ','
};
