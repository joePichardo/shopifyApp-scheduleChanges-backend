const { Router } = require('express');
const AccountTable = require('../account/table');
const AccountGameTable = require('../accountGame/table');
const Session = require('../account/session');
const { hash } = require('../account/helper');
const { setSession, authenticatedAccount } = require('./helper');
const ThemeBackup = require('../themeBackup/index');
const ThemeBackupTable = require('../themeBackup/table');

const router = new Router();

router.post('/schedule', (req, res, next) => {
  let themeBackup,
    fileKey,
    fileValue,
    ownerId,
    scheduleAt;

  const { storeAddress, date, key, value } = req.body;
  const accessToken = req.headers["x-shopify-access-token"];

  scheduleAt = date;
  fileKey = key;
  fileValue = value;

  console.log('fileKey', fileKey);
  console.log('fileValue', fileValue);

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
        ownerId
      });

      return ThemeBackupTable.storeThemeBackup(themeBackup);

    })
    .then(({ themeBackup }) => {
      return res.json({
        message: 'Successfully made a theme backup',
        themeBackup
      });
    })
    // .then(() => {
    //   res.json({ message: "Success" })
    // })
    .catch(error => next(error));
});

module.exports = router;