const dbActivities = require('../db/dbActivities');

// Maual entry activities
// Add manual entry activity
exports.addActivity = async (req, res) => {
  let { username, name, type, sport, distance,
    duration, datetime, description,
    intervalCount, intervalDistance } = req.body;

  // Checks that values are not defaults, if they are, replace with null
  if (username === 'string') {
    res.status(401).send('Error, need a username');
    return;
  }

  if (description === 'undefined' || description === '') {
    description = 'No Description';
  }

  // Add activity metadata to JSON in format similar to strava activity jsons
  const activityJson = {
    distance: distance || undefined,
    duration: duration || undefined,
    datetime: datetime || undefined,
    description: description,
    intervalCount: intervalCount || undefined,
    intervalDistance: intervalDistance || undefined
  };
  
  const returnValue = await dbActivities.createActivity(username, name, type, sport, activityJson);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding activity');
  } else {
    // On success return 200
    res.status(200).send(`Activity "${name}" added successfully for user "${username}".`);
  }
};

// Strava upload activities
exports.addActivityStrava = async (req, res) => {
  let {username, name, type, sport, json} = req.body;

  // No checking for parameters since this is not a direct interaction with user
  const returnValue = await dbActivities.createActivity(username, name, type, sport, json);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding activity');
  } else {
    // On success return 200
    res.status(200).send(`Activity "${name}" added successfully for user "${username}".`);
  }
  if (!req.body.hasOwnProperty('datetime')) {
    console.log('Warning: datetime is missing from request body.');
  }
  
};
// Delete activity from user's activities, either one if name is given or all
exports.deleteActivity = async (req, res) => {
  const username = req.query.username;
  const name = req.query.name;
  if (name != undefined) {
    returnValue = await dbActivities.deleteActivity(username, name);
  }
  else {
    returnValue = await dbActivities.clearActivities(username);
  }
    
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error deleting activity');
  } else {
    // On success return 200
    res.status(200).send(name);
  }
};

// Activity accessor functions (to expand in functionality and scope as filters are added)

// Get all activities that match query
exports.getActivities = async (req, res) => {
  const username = req.query.username;
  let name = req.query.name;
  let sport = req.query.sport;
  let distance = req.query.distance;
  let type = req.query.type;
  let duration = req.query.duration;
  let datetime = req.query.datetime;
  let intervalDistance = req.query.intervalDistance;
  let intervalCount = req.query.intervalCount;
  
  for (item of [name, sport, type, distance, 
    duration, datetime, intervalDistance, intervalCount]) {
      if (item == undefined) {
      item = null;
    }
  }

  const returnValue = await dbActivities.findActivity(username, name, sport);

  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting activities, user may not exist');
  } else {
    res.status(200).json(returnValue);
  }
};

