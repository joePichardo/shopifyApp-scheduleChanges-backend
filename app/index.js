const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const accountRouter = require('./api/account');
const gameRouter = require('./api/game');
const themeRouter = require('./api/theme');
const AccountTable = require('./account/table');

const app = express();

app.use(cors({ origin: 'http://localhost:1234', credentials: true }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/account', accountRouter);
app.use('/theme', themeRouter);
// app.use('/game', gameRouter);

app.post('/customers/redact', function (req, res) {
  return res.status(200)
})

app.post('/customers/data_request', function (req, res) {
  return res.status(200)
})

app.post('/shop/redact', function (req, res) {
  const {shop_id, shop_domain} = req.body;

  AccountTable.deleteAccount({ shop_domain })
    .then(() => {
      return res.status(200);
    })
    .catch(error => next(error));

})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    type: 'error', message: err.message
  });
});


module.exports = app;