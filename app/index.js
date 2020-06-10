const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const accountRouter = require('./api/account');
const gameRouter = require('./api/game');

const app = express();

app.use(cors({ origin: 'http://localhost:1234', credentials: true }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/account', accountRouter);
// app.use('/game', gameRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    type: 'error', message: err.message
  });
});


module.exports = app;