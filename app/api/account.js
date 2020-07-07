const { Router } = require('express');
const AccountTable = require('../account/table');
const AccountGameTable = require('../accountGame/table');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');

const router = new Router();

router.post('/signup', (req, res, next) => {
  const { storeAddress, accessToken } = req.body;

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {
      if (!account) {
        return AccountTable.storeAccount({ storeAddress, accessToken });
      } else {
        return AccountTable.updateAccessToken({ storeAddress, accessToken });
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

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  AccountTable.getAccount({ usernameHash: hash(username) })
    .then(({ account }) => {
      if (account && account.passwordHash === hash(password)) {
        const { sessionId } = account;

        return setSession({ username, res, sessionId });
      } else {
        const error = new Error('Incorrect username/password');

        error.statusCode = 409;

        throw error;
      }
    })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch(error => next(error));
});

router.get('/logout', (req, res, next) => {
  const { username } = Session.parse(req.cookies.sessionString);

  AccountTable.updateSessionId({
    sessionId: null,
    usernameHash: hash(username)
  })
    .then(() => {
      res.clearCookie('sessionString');

      res.json({ message: 'Successful logout' })
    })
    .catch(error => next(error));
});

router.get('/authenticated', (req, res, next) => {
  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ authenticated }) => res.json({ authenticated }))
    .catch(error => next(error));
});

router.get('/games', (req, res, next) => {
  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      return AccountGameTable.getAccountGames({
        accountId: account.id
      })
    })
    .then(games => {
      res.json({ games });
    })
    .catch(error => next(error));
});

router.get('/info', (req, res, next) => {
  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account, username }) => {
      res.json({ info: { balance: account.balance, username } });
    })
    .catch(error => next(error));
});

module.exports = router;