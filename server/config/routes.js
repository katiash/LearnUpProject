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
    response.render("dashboard");
  });
  // Admin route - renders admin.ejs:
  app.get("/admin", function(request, response) {
    response.render("admin", { message: request.flash("error") });
  });

  //Login post route
  app.post("/login", function(request, response) {
    users.login(request, response);
  });

  // Another example route - responses with JSON object:
  app.get("/users", function(request, response) {
    controller.getControllerMethod(request, response); //<-- CHANGE "controller" variable name(2)
  }); // <-- DO NOT ADD COMMAS if ADDING ROUTES BELOW.
};
