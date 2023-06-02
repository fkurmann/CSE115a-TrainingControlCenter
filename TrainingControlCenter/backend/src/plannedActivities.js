const dbPlans = require('../db/dbPlans');

/**
 * Entry of planned activities
 *
 * @async
 */
exports.addPlannedActivity = async (req, res) => {
  let {username, name, type, sport, description, distance, moving_time, start_date_local, end_date_local} = req.body;

  // Convert a date string to a Date object
  let date_start = start_date_local ? new Date(start_date_local) : null;
  let date_end = end_date_local ? new Date(end_date_local) : null;

  // Convert the date object to a YYYY/MM/DD format
  let formattedDateStart = date_start ? date_start.toISOString() : null;
  let formattedDateEnd = date_end ? date_end.toISOString() : null;

  // Input Value checks
  if (typeof distance !== 'undefined' && distance < 0) {
    res.status(401).send('Error, distance cannot be negative');
    return;
  }
  if (typeof moving_time !== 'undefined' && moving_time < 0) {
    res.status(401).send('Error, time cannot be negative');
    return;
  }

  let descriptionText = description ? String(description) : 'None';

  // Add activity metadata to JSON in format similar to strava activity jsons
  const activityJson = {
    name: name,
    sport_type: sport,
    distance: distance || undefined,
    moving_time: moving_time * 60 || undefined,
    start_date_local: formattedDateStart || undefined,
    end_date_local: formattedDateEnd || undefined,
  };

  const returnValue = await dbPlans.createPlannedActivity(username, name, type, sport, descriptionText, activityJson);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error adding planned activity');
  } else {
    // On success return 200
    res.status(200).send(`Planned activity "${name}" added successfully for user "${username}".`);
  }
};

/**
 * Delete activity from user's planned activities, either one if name is given or all
 *
 * @async
 */
exports.deletePlannedActivity = async (req, res) => {
  const username = req.query.username;
  const name = req.query.name;
  if (name != undefined) {
    returnValue = await dbPlans.deletePlannedActivity(username, name);
  }
  else {
    returnValue = await dbPlans.clearPlannedActivities(username);
  }

  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error deleting planned activity');
  } else {
    // On success return 200
    res.status(200).send(name);
  }
};

/**
 * Get all planned activities that match query
 *
 * @async
 */
exports.getPlannedActivities = async (req, res) => {
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

  const returnValue = await dbPlans.findPlannedActivity(username, name, sport, type, minDuration, maxDuration, minDistance, maxDistance, minDate, maxDate);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting planned activities, user may not exist');
  } else {
    res.status(200).json(returnValue);
  }
};
