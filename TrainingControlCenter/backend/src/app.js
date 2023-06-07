const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const auth = require('./auth');
const settings = require('./settings');
const activities = require('./activities');
const plannedActivities = require('./plannedActivities');
const graphs = require('./graphs');
const preferences = require('./preferences');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

// API Paths

// Register
app.post('/v0/register', auth.register);

// Login
app.post('/v0/login', auth.login);

// Strava token
app.post('/v0/token', auth.updateToken); 
app.get('/v0/token', auth.getToken); 

// Get, add, delete favorite sports
app.get('/v0/favorites', settings.getFavorites); 
app.post('/v0/favorites', settings.updateFavorites); 

// Get, add, delete goals
app.get('/v0/goals', settings.getGoals); 
app.post('/v0/goals', settings.addGoal); 
app.delete('/v0/goals', settings.deleteGoal); 

// Get, add, delete activities
app.get('/v0/activities', activities.getActivities); 
// Manual Entry
app.post('/v0/activities', activities.addActivity);
// Strava Entry
app.post('/v0/activitiesStrava', activities.addActivityStrava); 
app.delete('/v0/activities', activities.deleteActivity); 

// Get, add, delete activities
app.get('/v0/plannedActivities', plannedActivities.getPlannedActivities)
app.post('/v0/plannedActivities', plannedActivities.addPlannedActivity);
app.delete('/v0/plannedActivities', plannedActivities.deletePlannedActivity); 

// Graphing
app.post('/v0/graphs', graphs.drawGraph);

// Preferences
app.get('/v0/preferences', preferences.getPreferences);
app.post('/v0/preferences', preferences.updatePreferences);

app.use((err, req, res, next) => {
  // console.log(req);
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
