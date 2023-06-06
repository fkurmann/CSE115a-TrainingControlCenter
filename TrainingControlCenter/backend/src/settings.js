const dbUsers = require('../db/dbUsers');
const dbGoals = require('../db/dbGoals');

// Manage favorites
/**
 * Get all user's favorite sports
 */
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

/**
 * Update multiple of user's favorite sports. Can add or delete favorites
 */
exports.updateFavorites = async (req, res) => {
  const username = req.query.username;
  let add_favorites = req.query.add_favorites;
  let delete_favorites = req.query.delete_favorites;
  if (add_favorites) {
    add_favorites = add_favorites[0].split('%2C');
  }
  if (delete_favorites) {
    delete_favorites = delete_favorites[0].split('%2C');
  }
  let returnValue = await dbUsers.findUser(username, null);
  if (returnValue === -1) {
    res.status(401).send('Error adding favorite, no such user');
  } else {
    returnValue = await dbUsers.updateFavorites(username, add_favorites, delete_favorites);
    // Error case
    if (returnValue === -1) {
      res.status(401).send('Error adding favorite');
    } else {
      // On success return 200
      res.status(200).send('ok');
    }
  }
};

// Manage goals
// These functions deleberatly don't check for user existence, that is assumed at this point
/**
 * Add goal to user's goals, TODO check for goals with same name, existence
 *
 * @async
 */
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

/**
 * Get all goals that match query
 *
 * @async
 */
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

/**
 * Delete goal from user's goals TODO check for goals with same name, existence,
 *
 * @async
 */
exports.deleteGoal = async (req, res) => {
  const username = req.query.username;
  const name = decodeURIComponent(req.query.name);

  returnValue = await dbGoals.deleteGoal(username, name);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error deleting goal');
  } else {
    // On success return 200
    res.status(200).send(name);
  }
};
