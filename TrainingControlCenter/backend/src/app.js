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
const graphs = require('./graphs')

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
app.post('/v0/token', auth.updateToken);//auth.check,
app.get('/v0/token', auth.getToken);//auth.check,

// Get, add, delete favorite sports
app.get('/v0/favorites', settings.getFavorites);//auth.check,
app.post('/v0/favorites', settings.addFavorite);// auth.check,
app.delete('/v0/favorites', settings.deleteFavorite);//auth.check,

// Get, add, delete goals
app.get('/v0/goals', settings.getGoals);//auth.check,
app.post('/v0/goals', settings.addGoal);// auth.check,
app.delete('/v0/goals', settings.deleteGoal);//auth.check,

// Get, add, delete activities
app.get('/v0/activities', activities.getActivities);//auth.check,
// Manual Entry
app.post('/v0/activities', activities.addActivity);// auth.check,
// Strava Entry
app.post('/v0/activitiesStrava', activities.addActivityStrava);//auth.check,
app.delete('/v0/activities', activities.deleteActivity);//auth.check,

// Graphing, spawn python function
app.post('/v0/graphs', graphs.drawGraph);

app.use((err, req, res, next) => {
  // console.log(req);
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
