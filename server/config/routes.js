// //////////////////////////////////////////////////////////////
//  SERVER/CONFIG/ROUTES.JS FILE
// //////////////////////////////////////////////////////////////
// NOTE: "app" express application is passed to the current file
// from the server.js file when the node server starts.

// Require controller.js file and set it to a variable:
// ( Change the "controller" variable name and the controller file name
// within the 'controllers' directory. )
const users = require('../controllers/users.js');
const tiles = require('../controllers/tiles.js');

// Export all routes to server.js:
module.exports = function (app) {
  // Root route - renders index.ejs view (for socket.io example):
  app.get('/', (request, response) => {
    response.render('index');
  });

  app.get('/admin/dashboard', (request, response) => {
    if (request.session.user) {
      users.dashboard(request, response);
    } else {
      response.redirect('/admin');
    }
  });
  // Admin route - renders admin.ejs:
  app.get('/admin', (request, response) => {
    response.render('admin', { message: request.flash('error') });
  });

  app.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/admin');
  });

  // enter an individual learnup room
  app.get('/room/:id', (request, response) => {
    users.enterRoom(request, response);
  });

  app.get('/tiles', (request, response) => {
    tiles.getTiles(request, response);
  });

  app.post('/login', (request, response) => {
    users.login(request, response);
  });

  // New user post route
  app.post('/new', (request, response) => {
    users.newUser(request, response);
  });

  app.post('/edit', (request, response) => {
    users.editUser(request, response);
  });

  app.post('/promote/:id', (request, response) => {
    users.promote(request, response, 1);
  });

  app.post('/demote/:id', (request, response) => {
    users.promote(request, response, -1);
  });

  app.post('/delete/:id', (request, response) => {
    users.delete(request, response);
  });
};
