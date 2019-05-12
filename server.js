require('dotenv').config();
var express = require('express');
var app = express();
var passport = require('./config/passport/passport');
var session = require('express-session');
var exphbs = require('express-handlebars');
var db = require('./models');
var csvImporter = require('./importCSV/importCSV.js');

// Server port
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static('public'));

// Passport.js
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

// Sync options
var syncOptions = {
  force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') {
  syncOptions.force = true;
}

// Sync the models and start the server
db.sequelize.sync(syncOptions).then(function() {
  // Add initial admins
  db.User.findOrCreate({
    where: {
      email: 'admin@admin.com'
    },
    defaults: {
      password: '77!*zxc',
      admin: 1
    }
  });
  db.User.findOrCreate({
    where: {
      email: 'ryan@test.com'
    },
    defaults: {
      password: '1234',
      admin: 0
    }
  });

  // Import initial data from a csv file
  csvImporter('./importCSV/sample-data.csv', db);

  // Start the server
  app.listen(PORT, function() {
    console.log('Go to http://localhost:3000/ to see where the magic happens');
  });
});

module.exports = app;
