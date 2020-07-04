const { Router } = require('express');
const AccountTable = require('../account/table');
const AccountGameTable = require('../accountGame/table');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');
const ThemeBackup = require('../themeBackup/index');
const ThemeBackupTable = require('../themeBackup/table');
const ThemeSchedule = require('../themeSchedule/index');
const ThemeScheduleTable = require('../themeSchedule/table');

const router = new Router();

router.post('/schedule', (req, res, next) => {
  let ownerId, themeSchedule;

  const { storeAddress, scheduleAt, fileKey, fileValue, backupId, description } = req.body;
  const accessToken = req.headers["x-shopify-access-token"];

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {

      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      ownerId = account.id;

      themeSchedule = new ThemeSchedule({
        scheduleAt,
        fileKey,
        fileValue,
        ownerId,
        backupId,
        description
      });

      return ThemeScheduleTable.storeThemeSchedule(themeSchedule);

    })
    .then(({ themeSchedule }) => {
      return res.json({
        message: 'Successfully scheduled a theme update',
        themeSchedule
      });
    })
    .catch(error => next(error));
});

router.get('/schedules', (req, res, next) => {
  let ownerId;

  const accessToken = req.headers["x-shopify-access-token"];
  const storeAddress = req.headers["store-address"];

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {

      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      ownerId = account.id;

      // ?page=2&deployed=no
      let page = req.query.page;
      let deployed = req.query.deployed;
      let description = req.query.description;

      return ThemeScheduleTable.getThemeSchedules(ownerId, page, deployed, description);

    })
    .then(({ themeSchedules }) => {
      return res.json({
        message: 'Successfully found theme schedules',
        themeSchedules
      });
    })
    .catch(error => next(error));
});

router.post('/schedule/delete', (req, res, next) => {
  let ownerId;

  const accessToken = req.headers["x-shopify-access-token"];
  const storeAddress = req.headers["store-address"];

  const { scheduleId } = req.body;

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {

      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      ownerId = account.id;

      return ThemeScheduleTable.deleteThemeSchedule(ownerId, scheduleId);

    })
    .then(() => {
      return res.json({
        message: 'Successfully deleted scheduled change'
      });
    })
    .catch(error => next(error));
});

router.post('/schedule/update', (req, res, next) => {
  let ownerId;

  const accessToken = req.headers["x-shopify-access-token"];
  const storeAddress = req.headers["store-address"];

  const { scheduleId, scheduleAt, fileKey, fileValue, description, deployed } = req.body;

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {

      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      ownerId = account.id;

      return ThemeScheduleTable.updateThemeSchedule({ownerId, id: scheduleId, scheduleAt, fileKey, fileValue, description, deployed});

    })
    .then(() => {
      return res.json({
        message: 'Successfully updated scheduled change'
      });
    })
    .catch(error => next(error));
});

router.get('/backup/:id', (req, res, next) => {
  let ownerId;

  const backupId = req.params.id;

  const accessToken = req.headers["x-shopify-access-token"];
  const storeAddress = req.headers["store-address"];

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {

      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      ownerId = account.id;

      return ThemeBackupTable.getThemeBackup(ownerId, backupId);

    })
    .then(({themeBackup}) => {
      return res.json({
        message: 'Successfully deleted scheduled change',
        themeBackup
      });
    })
    .catch(error => next(error));
});

router.post('/backup', (req, res, next) => {
  let themeBackup, ownerId;

  const { storeAddress, fileKey, fileValue, themeId } = req.body;
  const accessToken = req.headers["x-shopify-access-token"];

  AccountTable.getAccount({ storeAddress })
    .then(({ account }) => {

      if (!account) {
        throw new Error("Account not found.");
      }

      if (account.accessToken !== accessToken) {
        throw new Error("Account not authorized.");
      }

      ownerId = account.id;

      themeBackup = new ThemeBackup({
        fileKey,
        fileValue,
        ownerId,
        themeId
      });

      return ThemeBackupTable.storeThemeBackup(themeBackup);
    })
    .then(({ themeBackup }) => {
      return res.json({
        message: 'Successfully made a theme backup',
        themeBackup
      });
    })
    .catch(error => next(error));
});

module.exports = router;