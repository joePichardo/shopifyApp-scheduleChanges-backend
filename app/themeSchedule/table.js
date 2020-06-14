const pool = require('../../databasePool');

class ThemeScheduleTable {
  static storeThemeSchedule(themeSchedule) {

    const {
      scheduleAt,
      fileKey,
      fileValue,
      ownerId,
      backupId
    } = themeSchedule;

    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO themeSchedule("scheduleAt", "fileKey", "fileValue", "ownerId", "backupId") VALUES($1, $2, $3, $4, $5) RETURNING *',
        [scheduleAt, fileKey, fileValue, ownerId, backupId],
        (error, response) => {
          if (error) {
            return error
          }

          resolve({ themeSchedule: response.rows[0] });
        }
      );
    })
  }
}

module.exports = ThemeScheduleTable;