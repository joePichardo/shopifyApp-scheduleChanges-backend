const { Router } = require('express');
const AccountTable = require('../account/table');
const AccountGameTable = require('../accountGame/table');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

router.post('/signup', (req, res, next) => {
  const { storeAddress, accessToken, email } = req.body;

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {
      if (!account) {
        return AccountTable.storeAccount({ storeAddress, accessToken, email });
      } else {
        return AccountTable.updateAccessToken({ storeAddress, accessToken, email });
      }
    })
    .then(() => {
      res.json({ message: "Success" })
    })
    .catch(error => next(error));
});

router.get('/staging', (req, res, next) => {
  const storeAddress = req.headers["store-address"];
  const accessToken = req.headers["x-shopify-access-token"];

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {
      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      return res.json({
        account
      });
    })
    .catch(error => next(error));
});

router.post('/staging', (req, res, next) => {
  const { storeAddress, stagingThemeName } = req.body;
  const accessToken = req.headers["x-shopify-access-token"];

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {
      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      return AccountTable.saveAccountStagingThemeName({ storeAddress, stagingThemeName });
    })
    .then(() => {
      res.json({ message: "Success" })
    })
    .catch(error => next(error));
});

router.get('/info', (req, res, next) => {
  const storeAddress = req.headers["store-address"];
  const accessToken = req.headers["x-shopify-access-token"];

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {
      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      return res.json({
        account
      });
    })
    .catch(error => next(error));
});

module.exports = router;