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
  app.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/login");
  });

  // Route for getting some data about our user to be used client side
  app.get('/api/user_data', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Route for checking if user is admin at index page
  app.post('/check-if-admin', (req, res) => {
    // console.log('request recieved');
    // console.log(req.body.id);
    return db.User.findOne({
      where: {
        email: req.body.id
      },
    }).then(project => {
      // true if admin, false if not
      console.log(project.dataValues.admin);
      res.json(project.dataValues.admin)
    });
  });
  // API route for querying the database. Example of a GET call:
  // /api/donors?donor_id=R1902502
  //            &ref_type=TE
  //            &min_age=5
  //            &max_age=50
  //            &follow_up=yes | no
  //            &org=Good+Samaritan+Medical+Center+-+Corvallis
  app.get('/api/donors', function(req, res) {
    if (!req.user) { // user not logged in
      res.status(401).send('401 Unauthorized'); // status 401 Unauthorized
    } else { // user logged in
      const where = {};
      if (req.query.donor_id) where.donorId = req.query.donor_id;
      if (req.query.ref_type) where.referralType = req.query.ref_type;
      const ageRange = [0, 1000];
      if (req.query.min_age) ageRange[0] = Number.parseInt(req.query.min_age);
      if (req.query.max_age) ageRange[1] = Number.parseInt(req.query.max_age);
      where.age = {
        $between: ageRange
      };
      if (req.query.follow_up === 'yes') where.isFollowUp = true;
      if (req.query.follow_up === 'no') where.isFollowUp = false;

      const inclWhere = {};
      if (req.query.org) inclWhere.name = req.query.org;

      db.Donor.findAll({
        where,
        include: [{
          model: db.Organization,
          where: inclWhere
        }]
      }).then(function(results) {
        res.json(results);
      });
    }
  });

  // API route for updating the followup requirement in the database. Example
  // of a PUT call:
  // /api/donors
  // reg.body = {
  //   donorId: R1902502,
  //   isFollowUp: "yes"
  // }
  app.put("/api/donors", function(req, res) {
    if (!req.user) { // user not logged in
      res.status(401).send('401 Unauthorized'); // status 401 Unauthorized
    } else { // user logged in
      const update = {
        isFollowUp: false
      };
      if (req.body.isFollowUp === "yes") update.isFollowUp = true;
      const where = {
        donorId: 0
      };
      if (req.body.donorId) where.donorId = req.body.donorId;

      db.Donor.update(update, {
        where
      }).then(function(results) {
        res.json(results);
      });
    }
  });

  // API route for querying the database. Example of a GET call:
  // /api/organizations?name=Good+Samaritan+Medical+Center+-+Corvallis
  //                   &donors=yes
  app.get('/api/organizations', function(req, res) {
    if (!req.user) { // user not logged in
      res.status(401).send('401 Unauthorized'); // status 401 Unauthorized
    } else { // user logged in
      const where = {};
      if (req.query.name) where.name = req.query.name;

      const include = req.query.donors === 'yes' ? [db.Donor] : undefined;

      db.Organization.findAll({
        where,
        include
      }).then(function(results) {
        res.json(results);
      });
    }
  });
};
