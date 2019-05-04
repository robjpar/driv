var db = require('../models');

module.exports = function(app) {
  // Load login page
  app.get('/login', function(req, res) {
  // render the page and pass in any flash data if it exists
    res.render('login', {
      msg: 'Welcome!',
      examples: dbExamples
    });
  });
};
