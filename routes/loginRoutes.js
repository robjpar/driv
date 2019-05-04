var passport = require('passport');

module.exports = function(app) {
  // Load login page
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json('/');
  });
};