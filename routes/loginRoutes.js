var db = require('../models');

module.exports = function(app) {
  // Load login page
  app.get('/login', (req,res) => {
    res.render('login', {
      msg: 'Welcome!',
      examples: dbExamples
    });
  });
  
  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }),
  (req,res) => {
    console.log('hello');

    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
    res.redirect('/');
  });
};