const dbUsers = require('../db/dbUsers');
const dbGoals = require('../db/dbGoals');

// Manage favorites
// Get all user's favorite sports
exports.getFavorites = async (req, res) => {
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

// Add sport to user's favorite sports
exports.addFavorite = async (req, res) => {
  // See if username is already taken
  const {username, password} = req.body;
  let returnValue = await dbUsers.findUser(username, 'BLANK');
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


// Delete sport from user's favorite sports
exports.deleteFavorite = async (req, res) => {
  

};

// Manage goals

