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
  login: function(request, response) {
    User.findOne({ email: request.body.email }).then(user => {
      if (user) {
        bcrypt.compare(request.body.password, user.hash).then(res => {
          if (res) {
            request.session["user"] = user.email;
            response.redirect("/admin/dashboard");
          } else {
            request.flash("error", "Incorrect password or username");
            response.redirect("/admin");
          }
        });
      } else {
        request.flash("error", "Incorrect password or username");
        response.redirect("/admin");
      }
    });
  },
  dashboard: function(request, response) {
    User.findOne({ email: request.session.user }).then(user => {
      let logged_user = user;
      User.find()
        .sort({ admin: -1 })
        .then(users => {
          response.render("dashboard", {
            user: user,
            users: users,
            message: request.flash("exists")
          });
        });
    });
  },
  newUser: function(request, response) {
    User.findOne({ email: request.session.email }).then(adminUser => {
      User.findOne({ email: request.body.newuseremail }).then(user => {
        if (!user) {
          let admin = this.getAdminCode(request.body.newuseradmin);
          bcrypt.hash("default", 10).then(new_hash => {
            User.create({
              email: request.body.newuseremail,
              admin: admin,
              hash: new_hash
            }).then(user => {
              request.flash("exists", "Successfully added " + user.email + ".");
              response.redirect("admin/dashboard");
            });
          });
        } else {
          request.flash(
            "exists",
            "Could not add user " +
              user.email +
              ". Username already exists in database."
          );
          response.redirect("admin/dashboard");
        }
      });
    });
  },
  editUser: function(request, response) {
    User.findOne({ email: request.session.user }).then(adminUser => {
      User.findOne({ email: request.body.edituseremail }).then(updateUser => {
        if (updateUser) {
          bcrypt.hash(request.body.edituserpassword, 10).then(new_hash => {
            let admin = this.getAdminCode(request.body.edituseradmin);
            if (adminUser.admin > updateUser.admin) {
              updateUser.hash = new_hash;
              updateUser.admin = admin;
              updateUser.save().then(user => {
                request.flash(
                  "exists",
                  "Successfully edited account details for " + user.email + "."
                );
                response.redirect("admin/dashboard");
              });
            } else {
              request.flash(
                "exists",
                "You not have adequate permissions to perform this operation."
              );
              response.redirect("admin/dashboard");
            }
          });
        } else {
          request.flash(
            "exists",
            "Could not find user " + request.body.edituseremail + "."
          );
          response.redirect("admin/dashboard");
        }
      });
    });
  },
  getAdminCode: function(adminString) {
    let admin;
    switch (adminString) {
      case "Admin":
        admin = 9;
        break;
      case "Teacher":
        admin = 8;
        break;
      default:
        admin = updateUser.admin;
    }

    return admin;
  },
  promote: function(request, response, type) {
    User.findOne({ email: request.session.user }).then(adminUser => {
      User.findOne({ _id: request.params.id }).then(user => {
        if (adminUser.admin > user.admin) {
          user.admin += type;
          user.save().then(user => {
            let promotion = type < 0 ? "demoted" : "promoted";
            request.flash(
              "exists",
              "Successfully " + promotion + " " + user.email + "."
            );
            response.redirect("/admin/dashboard");
          });
        } else {
          response.redirect("/admin/dashboard");
        }
      });
    });
  },
  delete: function(request, response) {
    User.findOne({ email: request.session.user }).then(adminUser => {
      User.findOne({ _id: request.params.id }).then(user => {
        if (adminUser.admin > user.admin) {
          User.remove({ _id: user.id })
            .then(deleteduser => {
              request.flash(
                "exists",
                "Successfully deleted " + user.email + "."
              );
              response.redirect("/admin/dashboard");
            })
            .catch(error => console.log(error));
        } else {
          response.redirect("/admin/dashboard");
        }
      });
    });
  } // <--- ADD ADDITIONAL METHODS SEPARATED BY A COMMA ','
};
