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

      let description = req.query.description;

      if (description.length > 150) {
        throw new Error("Description limit is 150 characters.");
      }

      ownerId = account.id;

      // ?page=2&deployed=no
      let page = req.query.page;
      let deployed = req.query.deployed;

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

router.get('/schedule/job', (req, res, next) => {

  ThemeScheduleTable.getThemeSchedulesBeforeNow()
    .then(({ themeSchedules }) => {

      themeSchedules.forEach((scheduleItem) => {

        deploySchedule(scheduleItem);

      })

      return true;

    })
    .then(() => {
      return res.json({
        message: 'Successfully deployed schedules'
      });
    })
    .catch(error => next(error));
});

deploySchedule = async (scheduleItem) => {

  const storeAddress = scheduleItem.storeAddress;
  const accessToken = scheduleItem.accessToken;
  let activeThemeId;

  try {

    const fetchURL = "https://" + storeAddress + "/admin/api/2019-04/themes.json";

    const results = await fetch(fetchURL, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    })
      .then(response => response.json())
      .then(json => json);

    if (results.themes !== undefined) {
      var themes = results.themes;
      themes.forEach((theme) => {
        if (theme.role === "main") {
          activeThemeId = theme.id;
        }
      })
    }

  } catch (err) {
    console.log(err);
  }

  if (activeThemeId) {
    try {
      const fetchURL = "https://" + storeAddress + "/admin/api/2019-04/themes/" + activeThemeId + "/assets.json";

      const asset = {
        key: scheduleItem.fileKey,
        value: scheduleItem.fileValue
      }

      const results = await fetch(fetchURL, {
        method: "PUT",
        body: JSON.stringify(asset),
        headers: {
          "X-Shopify-Access-Token": accessToken,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {

          let deployedScheduleItem = {
            id: scheduleItem.scheduleId,
            ownerId: scheduleItem.accountId,
            deployed: true
          };

          fetch(`http://localhost:3001/theme/schedule/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-Shopify-Access-Token": accessToken,
              "store-address": storeAddress,
            },
            body: JSON.stringify(deployedScheduleItem)
          })

        });

    } catch (err) {
      console.log(err);
    }
  }


}

module.exports = router;