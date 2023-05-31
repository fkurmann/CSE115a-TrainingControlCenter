const dbPreferences = require('../db/dbPreferences');

// Manage preferences
/**
 * Update user's preferences
 */
exports.updatePreferences = async (req, res) => {
  let {username, isMetric, colorTheme, brightnessMode, activityMapColor, activityMapMarkers} = req.body;
  console.log(JSON.stringify(req.body));
  let updatedPreferences = {};
  if (isMetric != null) {
    updatedPreferences.isMetric = isMetric;
  }
  if (colorTheme != null) {
    updatedPreferences.colorTheme = colorTheme;
  }
  if (brightnessMode != null) {
    updatedPreferences.brightnessMode = brightnessMode;
  }
  if (activityMapColor != null) {
    updatedPreferences.activityMapColor = activityMapColor;
  }
  if (activityMapMarkers != null) {
    updatedPreferences.activityMapMarkers = activityMapMarkers;
  }
  if (Object.keys(updatedPreferences).length === 0) {
    res.status(200).send('No preferences were updated');
    return;
  }
  const returnValue = await dbPreferences.updatePreferences(username, updatedPreferences);
  if (returnValue === -1) {
    res.status(401).send('Error updating preferences');
  }
  else {
    res.status(200).send(`Updated preferences: ${JSON.stringify(updatedPreferences)}`)
  }
};

/**
 * Get user's preferences
 */
exports.getPreferences = async (req, res) => {
  const username = req.query.username;
  const returnValue = await dbPreferences.findPreferences(username);
  res.status(200).json(returnValue);
};