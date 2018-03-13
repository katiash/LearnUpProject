// //////////////////////////////////////////////////////////////////////////////////////
//  SERVER/CONTROLLERS/CONTROLLER_NAME_PLURAL.JS FILE (CONTROLLER for a MODEL ):
// ///////////////////////////////////////////////////////////////////////////////////////
// Require Mongoose module in the following files:
// - mongoose.js file,
// - HERE,
// - SCHEMA/MODEL file.
// ///////////////////////////////////////////////////////////////////////////////////////

// STEP 1 (DB/SCHEMA SETUP):
// Require Mongoose module:
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// STEP 4 (DB/SCHEMA SETUP): Declare/define controller on model & export to routes.js:
// ////////////////////////////////////////////////////////////////////////////////////////
//  Retrieve a defined schema from mongoose models:
// 'User' variable object comforms to a model_instance retrieved from mongoose models.
const User = mongoose.model('User');

module.exports = {
  // EXAMPLE OF A CRUD get REQUEST method:
  login(request, response) {
    User.findOne({ email: request.body.email }).then((user) => {
      if (user) {
        bcrypt.compare(request.body.password, user.hash).then((res) => {
          if (res) {
            request.session.user = user.email;
            response.redirect('/admin/dashboard');
          } else {
            request.flash('error', 'Incorrect password or username');
            response.redirect('/admin');
          }
        });
      } else {
        request.flash('error', 'Incorrect password or username');
        response.redirect('/admin');
      }
    });
  },
  dashboard(request, response) {
    User.findOne({ email: request.session.user }).then((user) => {
      User.find()
        .sort({ admin: -1 })
        .then((users) => {
          response.render('dashboard', {
            user,
            users,
            message: request.flash('exists'),
          });
        });
    });
  },
  newUser(request, response) {
    User.findOne({ email: request.session.email }).then(() => {
      User.findOne({ email: request.body.newuseremail }).then((user) => {
        if (!user) {
          const admin = this.getAdminCode(request.body.newuseradmin);
          bcrypt.hash('default', 10).then((newHash) => {
            User.create({
              email: request.body.newuseremail,
              admin,
              hash: newHash,
            }).then((newUser) => {
              request.flash('exists', `Successfully added ${newUser.email}.`);
              response.redirect('admin/dashboard');
            });
          });
        } else {
          request.flash(
            'exists',
            `Could not add user ${user.email}. Username already exists in database.`,
          );
          response.redirect('admin/dashboard');
        }
      });
    });
  },
  editUser(request, response) {
    User.findOne({ email: request.session.user }).then((adminUser) => {
      User.findOne({ email: request.body.edituseremail }).then((updateUser) => {
        if (updateUser) {
          bcrypt.hash(request.body.edituserpassword, 10).then((newHash) => {
            const admin = this.getAdminCode(request.body.edituseradmin);
            if (adminUser.admin > updateUser.admin) {
              updateUser.hash = newHash;
              updateUser.admin = admin;
              updateUser.save().then((user) => {
                request.flash('exists', `Successfully edited account details for ${user.email}.`);
                response.redirect('admin/dashboard');
              });
            } else {
              request.flash(
                'exists',
                'You not have adequate permissions to perform this operation.',
              );
              response.redirect('admin/dashboard');
            }
          });
        } else {
          request.flash('exists', `Could not find user ${request.body.edituseremail}.`);
          response.redirect('admin/dashboard');
        }
      });
    });
  },
  getAdminCode(adminString) {
    let admin;
    switch (adminString) {
      case 'Admin':
        admin = 9;
        break;
      case 'Teacher':
        admin = 8;
        break;
      default:
        admin = 8;
    }

    return admin;
  },
  promote(request, response, type) {
    User.findOne({ email: request.session.user }).then((adminUser) => {
      User.findOne({ _id: request.params.id }).then((user) => {
        if (adminUser.admin > user.admin) {
          user.admin += type;
          user.save().then((savedUser) => {
            const promotion = type < 0 ? 'demoted' : 'promoted';
            request.flash('exists', `Successfully ${promotion} ${savedUser.email}.`);
            response.redirect('/admin/dashboard');
          });
        } else {
          response.redirect('/admin/dashboard');
        }
      });
    });
  },
  delete(request, response) {
    User.findOne({ email: request.session.user }).then((adminUser) => {
      User.findOne({ _id: request.params.id }).then((user) => {
        if (adminUser.admin > user.admin) {
          User.remove({ _id: user.id })
            .then(() => {
              request.flash('exists', `Successfully deleted ${user.email}.`);
              response.redirect('/admin/dashboard');
            })
            .catch(error => console.log(error));
        } else {
          response.redirect('/admin/dashboard');
        }
      });
    });
  },
  enterRoom(request, response) {
    User.findOne({ _id: request.params.id })
      .then((user) => {
        if (user) {
          var isadmin;
          if (request.session.user) {
            isadmin = true;
          }
          else {
            isadmin = false;
          }
          var tiles = require('../../static/tiles.json');
          response.render('board', {
            id: user.id,
            admin: isadmin,
            prefixes: tiles.sidetwo.prefixes,
            endingsright: tiles.sidetwo.endingsright,
            endingsbottom: tiles.sidetwo.endingsbottom,
            roots: tiles.sidetwo.roots,
            starstop: tiles.sideone.starstop,
            starsleft: tiles.sideone.starsleft,
            starsright: tiles.sideone.starsright,
            starsbottom: tiles.sideone.starsbottom,
            dipper: tiles.sideone.dipper,
            crescent: tiles.sideone.crescent,
            earth: tiles.sideone.earth});
        } else {
          response.redirect('admin');
        }
      })
      .catch((error) => {
        console.log(error);
        response.redirect('/admin');
      });
  }, // <--- ADD ADDITIONAL METHODS SEPARATED BY A COMMA ','
};
