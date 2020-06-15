const pool = require('../../databasePool');

class ThemeScheduleTable {
  static storeThemeSchedule(themeSchedule) {

    const {
      scheduleAt,
      fileKey,
      fileValue,
      ownerId,
      backupId,
      description
    } = themeSchedule;

    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO themeSchedule("scheduleAt", "fileKey", "fileValue", "ownerId", "backupId", "description") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        [scheduleAt, fileKey, fileValue, ownerId, backupId, description],
        (error, response) => {
          if (error) {
            return error
          }

          resolve({ themeSchedule: response.rows[0] });
        }
      );
    })
  }

  static getThemeSchedules(accountId) {

    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM themeSchedule WHERE "ownerId" = $1',
        [accountId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({themeSchedules: response.rows});
        }
      )
    })
  }

  static deleteThemeSchedule(accountId, scheduleId) {

    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM themeSchedule WHERE "ownerId" = $1 AND id = $2',
        [accountId, scheduleId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve();
        }
      )
    })
  }


}

module.exports = ThemeScheduleTable;