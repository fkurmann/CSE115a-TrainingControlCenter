const dbActivities = require('../db/dbActivities');

/**
 * Maual entry activities
 *
 * @async
 */
exports.addActivity = async (req, res) => {
  let {username, name, type, sport, description} = req.body;
  let {distance, time, start_date_local} = req.body.json;

  console.log(start_date_local);

  // Convert a date string to a Date object
  let date = start_date_local ? new Date(start_date_local) : null;

  // Convert the date object to a YYYY/MM/DD format
  let formattedDate = date ? date.toISOString() : null;

  // Checks that values are not defaults, if they are, replace with null
  if (username === 'string') {
    res.status(401).send('Error, need a username');
    return;
  }
  if (name === 'string') {
    res.status(401).send('Error, need an activity name');
    return;
  }
  if (type === 'string') {
    res.status(401).send('Error, need an activity type');
    return;
  }
  if (sport === 'string') {
    res.status(401).send('Error, need a sport type');
    return;
  }
  if (sport === 'string') {
    res.status(401).send('Error, need a sport type');
    return;
  }
  if (typeof distance !== 'undefined' && distance < 0) {
    res.status(401).send('Error, distance cannot be negative');
    return;
  }
  if (typeof time !== 'undefined' && time < 0) {
    res.status(401).send('Error, time cannot be negative');
    return;
  }

  let descriptionText = description ? String(description) : 'None';

  // Add activity metadata to JSON in format similar to strava activity jsons
  const activityJson = {
    name: name,
    sport_type: sport,
    distance: distance || undefined,
    moving_time: time * 60 || undefined,
    start_date: formattedDate || undefined,
    start_date_local: formattedDate || undefined
  };

  const returnValue = await dbActivities.createActivity(username, name, type, sport, descriptionText, activityJson);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding activity');
  } else {
    // On success return 200
    res.status(200).send(`Activity "${name}" added successfully for user "${username}".`);
  }
};

/**
 * Strava upload activities
 *
 * @async
 */
exports.addActivityStrava = async (req, res) => {
  let {username, name, type, sport, description, json} = req.body;

  // No checking for parameters since this is not a direct interaction with user
  const returnValue = await dbActivities.createActivity(username, name, type, sport, description, json);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding activity');
  } else {
    // On success return 200
    res.status(200).send(`Activity "${name}" added successfully for user "${username}".`);
  }
  // if (!req.body.hasOwnProperty('datetime')) {
  //   console.log('Warning: datetime is missing from request body.');
  // }

};

/**
 * Delete activity from user's activities, either one if name is given or all
 *
 * @async
 */
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

/**
 * Get all activities that match query
 *
 * @async
 */
exports.getActivities = async (req, res) => {
  const username = req.query.username;
  let name = req.query.name;
  let sport = req.query.sport;
  let type = req.query.type;
  let minDuration = req.query.minDuration;
  let maxDuration = req.query.maxDuration;
  let minDistance = req.query.minDistance;
  let maxDistance = req.query.maxDistance;
  let minDate = req.query.minDate;
  let maxDate = req.query.maxDate;

  // Convert duration and distance units to database format from frontend format
  if (minDuration) {
    minDuration = minDuration / 60;
  } if (maxDuration) {
    maxDuration = maxDuration / 60;
  } if (minDistance) {
    minDistance = minDistance * 1609.34;
  } if (maxDistance) {
    maxDistance = maxDistance * 1609.34;
  }

  for (item of [name, sport, type, minDuration, maxDuration, minDistance, maxDistance, minDate, maxDate]) {
    if (item == undefined) {
      item = null;
    }
  }

  const returnValue = await dbActivities.findActivity(username, name, sport, type, minDuration, maxDuration, minDistance, maxDistance, minDate, maxDate);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting activities, user may not exist');
  } else {
    res.status(200).json(returnValue);
  }
};
