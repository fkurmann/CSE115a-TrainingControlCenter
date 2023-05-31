const jwt = require('jsonwebtoken');
const dbUsers = require('../db/dbUsers');
const dbPreferences = require('../db/dbPreferences');

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ
lbWFpbCI6ImFubmFAYm9va3MuY29tIiwicm9sZSI6ImFkbWluIiwiaW
F0IjoxNjA2Mjc3MDAxLCJleHAiOjE2MDYyNzcwNjF9.1nwY0lDMGrb7
AUFFgSaYd4Q7Tzr-BjABclmoKZOqmr4`;

/**
 * Login as a user, returns access token
 *
 * @async
 */
exports.login = async (req, res) => {
  const {username, password} = req.body;
  // Check if user with these credentials exists
  const returnValue = await dbUsers.findUser(username, password);
  const myPreferences = await dbPreferences.findPreferences(username);
  if (returnValue === -1) {
    res.status(401).send('Invalid credentials');
  } else {
    // Issue JSON web token for user
    const accessToken = jwt.sign(
      {username: username},
      token, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
    res.status(200).json({
      username: username,
      accessToken: accessToken,
      favorites: returnValue.favorites,
      isMetric: myPreferences.isMetric || false,
      brightnessMode: myPreferences.brightnessMode || 'light',
      colorTheme: myPreferences.colorTheme || 'blue',
      activityMapColor: myPreferences.activityMapColor || 'red',
      activityMapMarkers: myPreferences.activityMapMarkers || false,
    });
  }
};

/**
 * Register a new user
 *
 * @async
 */
exports.register = async (req, res) => {
  console.log('Registration function');
  // See if username is already taken
  const {username, password} = req.body;
  let returnValue = await dbUsers.findUser(username, null);
  if (returnValue !== -1) {
    res.status(401).send('Username already taken');
  } else {
    // If username is availible, issue it
    returnValue = await dbUsers.createUser(username, password);
    res.status(200).json({
      username: username,
      password: password,
    });
  }
};

/**
 * Check that authentication token is issued
 *
 * @async
 */
exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userToken = authHeader.split(' ')[1];
  jwt.verify(userToken, token, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

/**
 * Add or update strava token
 *
 * @async
 */
exports.updateToken = async (req, res) => {
  // See if username is already taken
  const username = req.query.username;
  const token = req.query.token;
  let returnValue = await dbUsers.findUser(username, null);
  if (returnValue === -1) {
    res.status(401).send('No such username');
  } else {
    // If username is issued, update token
    returnValue = await dbUsers.updateUser(username, token);
    res.status(200).send(token);
  }
};

/**
 * Get strava token
 *
 * @async
 */
exports.getToken = async (req, res) => {
  const username = req.query.username;
  const returnValue = await dbUsers.findUser(username, null);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting token, user may not exist');
  } else {
    // On success return 200
    const token = returnValue.stravaToken;
    res.status(200).json({
      username: username,
      stravaToken: returnValue.stravaToken,
    });
  }
};
