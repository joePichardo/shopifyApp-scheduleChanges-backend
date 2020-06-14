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

      return ThemeScheduleTable.getThemeSchedules(ownerId);

    })
    .then(({ themeSchedules }) => {
      return res.json({
        message: 'Successfully found theme schedules',
        themeSchedules
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