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

  static getThemeSchedules(accountId, page, deployedQuery, description) {

    let queryArray = [];

    let limit = 10;
    let offset = 0;

    if (page > 1) {
      offset = (page - 1) * limit;
    }

    let deployed = "FALSE";
    if (deployedQuery === "yes") {
      deployed = "TRUE";
    }

    let selectQuery = 'SELECT * FROM themeSchedule';

    queryArray.push(accountId);
    selectQuery += ' WHERE "ownerId" = $' + queryArray.length;

    queryArray.push(deployed);
    selectQuery += ' AND deployed = $' + queryArray.length;

    if (description !== "") {
      queryArray.push(description);
      selectQuery += " AND description LIKE '%'  || $" + queryArray.length + " || '%'";

    }

    queryArray.push(limit);
    selectQuery += ' LIMIT $' + queryArray.length;

    queryArray.push(offset);
    selectQuery += ' OFFSET $' + queryArray.length;

    return new Promise((resolve, reject) => {
      pool.query(
        selectQuery,
        queryArray,
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

  static updateThemeSchedule({ id, ownerId, scheduleAt, fileKey, fileValue, description, deployed }) {
    // console.log('id', id);
    // console.log('ownerId', ownerId);
    const settingsMap = { scheduleAt, fileKey, fileValue, description, deployed };

    const validQueries = Object.entries(settingsMap).filter(([settingKey, settingValue]) => {
      // console.log('settingKey', settingKey, 'settingValue', settingValue);

      if (settingValue !== undefined) {
        return new Promise((resolve, reject) => {
          pool.query(
            `UPDATE themeSchedule SET "${settingKey}" = $1 WHERE id = $2 AND "ownerId" = $3`,
            [settingValue, id, ownerId],
            (error, response) => {
              if (error) {
                return reject(error);
              }

              resolve();
            }
          );
        });
      }
    });

    return Promise.all(validQueries);
  }


}

module.exports = ThemeScheduleTable;