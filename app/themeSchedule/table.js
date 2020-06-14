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


}

module.exports = ThemeScheduleTable;