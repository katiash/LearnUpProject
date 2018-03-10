////////////////////////////////////////////////////////////////
//  SERVER/CONFIG/ROUTES.JS FILE
////////////////////////////////////////////////////////////////
// NOTE: "app" express application is passed to the current file
// from the server.js file when the node server starts.

// Require controller.js file and set it to a variable:
// ( Change the "controller" variable name and the controller file name
// within the 'controllers' directory. )
var users = require("../controllers/users.js");

// Export all routes to server.js:
module.exports = function(app) {
  // Root route - renders index.ejs view (for socket.io example):
  app.get("/", function(request, response) {
    response.render("index");
  });

  app.get("/admin/dashboard", function(request, response) {
    if (request.session["user"]) {
      users.dashboard(request, response);
    } else {
      response.redirect("/admin");
    }
  });
  // Admin route - renders admin.ejs:
  app.get("/admin", function(request, response) {
    response.render("admin", { message: request.flash("error") });
  });

  app.get("/logout", function(request, response) {
    request.session.destroy();
    response.redirect("/admin");
  });

  //Login post route
  app.post("/login", function(request, response) {
    users.login(request, response);
  });

  //New user post route
  app.post("/new", function(request, response) {
    users.newUser(request, response);
  });

  app.post("/edit", function(request, response) {
    users.editUser(request, response);
  });

  app.post("/promote/:id", function(request, response) {
    users.promote(request, response, 1);
  });

  app.post("/demote/:id", function(request, response) {
    users.promote(request, response, -1);
  });

  app.post("/delete/:id", function(request, response) {
    users.delete(request, response);
  });

  // Another example route - responses with JSON object:
  app.get("/users", function(request, response) {
    controller.getControllerMethod(request, response); //<-- CHANGE "controller" variable name(2)
  }); // <-- DO NOT ADD COMMAS if ADDING ROUTES BELOW.
};
