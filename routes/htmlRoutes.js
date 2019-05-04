var db = require('../models');

module.exports = function(app) {
  // Load index page
  app.get('/', function(req, res) {
    if (req.user) {
      db.Example.findAll({}).then(function(dbExamples) {
        res.render('index', {
          msg: 'Welcome!',
          examples: dbExamples
        });
      });
    } else {
      res.redirect('/login');
    }
    
  });
  app.get('/login', (req,res) => {
    res.render('login');
  });

  app.get('/new-user', (req,res) => {
    if (req.user) {
      res.render('new-user');
    } else {
      res.redirect('/login');
    }
  })

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });
};
