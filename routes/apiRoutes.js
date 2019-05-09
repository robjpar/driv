var db = require('../models');
var passport = require('../config/passport/passport');

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the index route. the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json('/');
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely
  // If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/new-user', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let admin;
    if (req.body.admin.toLowerCase() === 'no') {
      admin = 0;
    } else {
      admin = 1;
    }
    db.User.create({
      email: email,
      password: password,
      admin: admin
    }).then(function() {
      res.json('/');
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  // Route for logging user out
  app.get('/logout', function (req, res) {
    // console.log('logging user out');
    req.logout();
    req.session.destroy();
    res.redirect("/login");
  });
  // Route for getting some data about our user to be used client side
  app.get('/api/user_data', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
  // route for checking if user is admin at index page
  app.post('/check-if-admin', (req,res) => {
    // console.log('request recieved');
    // console.log(req.body.id);
    return db.User.findOne({
      where: {email: req.body.id},
    }).then(project => {
      // true if admin, false if not
      console.log(project.dataValues.admin);
      res.json(project.dataValues.admin)
    })
  })

};
