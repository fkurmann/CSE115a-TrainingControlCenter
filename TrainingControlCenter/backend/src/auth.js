const jwt = require('jsonwebtoken');
const dbUsers = require('../db/dbUsers')

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ
lbWFpbCI6ImFubmFAYm9va3MuY29tIiwicm9sZSI6ImFkbWluIiwiaW
F0IjoxNjA2Mjc3MDAxLCJleHAiOjE2MDYyNzcwNjF9.1nwY0lDMGrb7
AUFFgSaYd4Q7Tzr-BjABclmoKZOqmr4`;

// Login as a user, returns access token
exports.login = async (req, res) => {
  const {username, password} = req.body;
  // Check if user with these credentials exists
  const returnValue = await dbUsers.findUser(username, password);
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
      username: username, accessToken: accessToken
    });
  }
};

// Register a new user
exports.register = async (req, res) => {
  // See if username is already taken
  const {username, password} = req.body;
  let returnValue = await dbUsers.findUser(username, null);
  if (returnValue !== -1) {
    res.status(401).send('Username already taken');
  } else {
    // If username is availible, issue it
    returnValue = await dbUsers.createUser(username, password);
    res.status(200).json({
      username: username, password: password
    });    
  }
};


// Check that authentication token is issued
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
