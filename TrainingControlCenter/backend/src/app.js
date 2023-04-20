// import express from 'express';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import cors from 'cors';

// import tccRoutes from './src/routes/tcc.js';

// const app = express();

// app.use('/tcc', tccRoutes);

// app.use(bodyParser.json({limit: "30mb", extended: true}));
// app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
// app.use(cors());

// const CONNECTION_URL = 'mongodb+srv://fkurmann:04AXKAT6QrqHHQGV@trainingcontrolcenter.szdxy0v.mongodb.net/test';
// const PORT = process.env.PORT || 5000;

// mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
//   .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
//   .catch((error) => console.log(error.message));

const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const auth = require('./auth');

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

// Login
app.post('/v0/login', auth.login);


// // Examples for future routes
// app.get('/v0/mailbox', auth.check, mailboxes.getAllMB);
// // To make/delete mailboxes
// app.post('/v0/mailbox', auth.check, mailboxes.post);

// // To view emails for a specific (user AND mailbox) OR (user AND subject query)
// app.get('/v0/mail', auth.check, mails.getAll);

// // To make new emails, does not make new MAILBOXES
// app.post('/v0/mail', auth.check, mails.post);

// // To move emails around, does not make new MAILBOXES
// app.put('/v0/mail/:id', auth.check, mails.put);

// // To toggle stars
// app.get('/v0/mail/:id', auth.check, mails.getID);


app.use((err, req, res, next) => {
  // console.log(req);
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;