require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const {
  mongoUri,
  mongoOptions,
  cbMongoConnected,
  cbMongoErrorConnect,
} = require('./utils/db');

const {
  PORT = 3000,
} = process.env;

const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/rateLimiter');
const router = require('./routes');

const allowedCors = require('./utils/constants');

const app = express();

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());

app.use(cors({
  origin: allowedCors,
}));

mongoose
  .connect(mongoUri, mongoOptions)
  .then(cbMongoConnected)
  .catch(cbMongoErrorConnect);

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
