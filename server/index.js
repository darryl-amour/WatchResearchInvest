const express = require('express');
const mongoose = require('mongoose');

const importCompanies = require('./utils/importCompanyFromCsv');

const app = express();

// Retrieve Configuration
const { expressServerPort, mongoDBURI } = require('./../config/keys');

// Connect to Database
mongoose.connect(mongoDBURI, { useNewUrlParser: true })
  .then(() => console.log(`Connected to database: ${mongoose.connection.name}`));

app.get(
  '/companysync',
  importCompanies,
  (req, resp) => {
    resp.status(200);
    resp.json({ sucess: 'Companies Added' });
  },
);

// Listen to route requests
app.listen(
  expressServerPort,
  () => {
    console.log(`Server Listening on PORT: ${expressServerPort}...`);
  },
);
