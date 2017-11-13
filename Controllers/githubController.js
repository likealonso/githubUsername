const request = require('request');
const rootURL = 'https://api.github.com/';

function userDetails(req, res) {
    var username = req.body.username || req.query.username;
    if (!username) return res.render('index', {userData: null});
    var options = {
        url: `${rootURL}users/${req.body.username}`,
        headers: {
          'User-Agent': 'likealonso',
          'Authorization' : `token ${process.env.GITHUB_TOKEN}`
        }
    };
    request(options, function(err, response, body) {
      var userData = JSON.parse(body);
      // update the options url to fetch the user's repos
      options.url = userData.repos_url;
      request(options, function(err, response, body) {
        // add a repos property
        userData.repos = JSON.parse(body);
        res.render('index', {userData});
      });
    });
  }

function search(req, res) {
    var options = {
        url: `${rootURL}search/users?q=${req.body.search} in:fullname`,
        headers: {
        'User-Agent': 'likealonso',
        'Authorization' : `token ${process.env.GITHUB_TOKEN}`
        }
    };
    request(options, function(err, response, body) {
        var usersData = JSON.parse(body);
        res.render('show', {usersData});
    });
}

module.exports = {
    userDetails,
    search
}