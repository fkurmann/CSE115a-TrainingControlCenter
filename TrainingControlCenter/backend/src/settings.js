const dbUsers = require('../db/dbUsers');
const dbGoals = require('../db/dbGoals');

// Manage favorites
// Get all user's favorite sports
exports.addFavorite = async (req, res) => {
  const username = req.query.username;
  const sport = req.query.sport;

  let returnValue = await dbUsers.findUser(username, 'BLANK');
  if (returnValue === -1) {
    res.status(401).send('Error adding favorite, no such user');
  }

  returnValue = await dbUsers.addFavorite(username, sport);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding favorite');
  } else {
    // On success return 200
    res.status(200).send();
  }
};

// Add sport to user's favorite sports
exports.getFavorites = async (req, res) => {
  const username = req.query.username;

  const returnValue = await dbUsers.findUser(username, 'BLANK');
  console.log('Returning favorites');
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting favorites, user may not exist');
  } else {
    // On success return 200
    const favorites = returnValue.favorites;
    res.status(200).json(favorites);
  }
};


// Delete sport from user's favorite sports
exports.deleteFavorite = async (req, res) => {
  const username = req.query.username;
  const sport = req.query.sport;

  const returnValue = await dbUsers.deleteFavorite(username, sport);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error deleting favorite');
  } else {
    // On success return 200
    res.status(200).send();
  }
};

// Manage goals

