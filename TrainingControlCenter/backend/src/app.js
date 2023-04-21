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

// Register
app.post('/v0/register', auth.register);

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