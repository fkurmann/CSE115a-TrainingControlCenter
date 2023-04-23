const dbUsers = require('../db/dbUsers');
const dbGoals = require('../db/dbGoals');

// Manage favorites
// Add sport to user's favorite sports
exports.addFavorite = async (req, res) => {
  const username = req.query.username;
  const sport = req.query.sport;

  let returnValue = await dbUsers.findUser(username, null);
  if (returnValue === -1) {
    res.status(401).send('Error adding favorite, no such user');
  } else if (returnValue.favorites.includes(sport)) {
    res.status(401).send('Error, user already has this favorite');
  } else {
    returnValue = await dbUsers.addFavorite(username, sport);
    // Error case
    if (returnValue === -1) {
      res.status(401).send('Error adding favorite');
    } else {
      // On success return 200
      res.status(200).send(sport);
    }
  }
};

// Get all user's favorite sports
exports.getFavorites = async (req, res) => {
  const username = req.query.username;

  const returnValue = await dbUsers.findUser(username, null);
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

  let returnValue = await dbUsers.findUser(username, null);
  if (returnValue === -1) {
    res.status(401).send('Error adding favorite, no such user');
  } else if (!returnValue.favorites.includes(sport)) {
    res.status(401).send('Error, user has no such favorite');
  } else {
    console.log('In else condition');
    returnValue = await dbUsers.deleteFavorite(username, sport);
    // Error case
    if (returnValue === -1) {
      res.status(401).send('Error deleting favorite');
    } else {
      // On success return 200
      res.status(200).send(sport);
    }
  }
};

// Manage goals
// These functions deleberatly don't check for user existence, that is assumed at this point
// Add goal to user's goals, TODO check for goals with same name, existence
exports.addGoal = async (req, res) => {
  let {username, name, type, sport, distance, time} = req.body;

  // Checks that values are not defaults, it they are, replacaed with null
  if (username === 'string') {
    res.status(401).send('Error, need a username');
    return;
  }
  if (name === 'string') {
    res.status(401).send('Error, need a goal name');
    return;
  }
  if (type === 'string') {
    type = null;
  }
  if (sport === 'string') {
    sport = null;
  }
  if (distance === 0) {
    distance = null;
  }
  if (time === 0) {
    time = null;
  }

  let returnValue = await dbGoals.createGoal(username, name, type, sport, distance, time);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding goal');
  } else {
    // On success return 200
    res.status(200).send(name);
  }

};

// Get all user's favorite sports
exports.getGoals = async (req, res) => {
  const username = req.query.username;
  let name = null;
  let type = null;
  let sport = null;
  if (req.query.name) {
    name = req.query.name;
  }
  if (req.query.type) {
    type = req.query.type;
  }
  if (req.query.sport) {
    sport = req.query.sport;
  }

  const returnValue = await dbGoals.findGoal(username, name, type, sport);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting goals, user may not exist');
  } else {
    res.status(200).json(returnValue);
  }
};

// Delete goal from user's goals TODO check for goals with same name, existence, 
exports.deleteGoal = async (req, res) => {
  const username = req.query.username;
  const name = req.query.name;
    
  returnValue = await dbGoals.deleteGoal(username, name);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error deleting goal');
  } else {
    // On success return 200
    res.status(200).send(name);
  }

};