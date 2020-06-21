const pool = require('../../databasePool');

class ThemeBackupTable {
  static storeThemeBackup(themeBackup) {

    const {
      createdAt,
      fileKey,
      fileValue,
      ownerId,
      themeId
    } = themeBackup;

    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO themeBackup("createdAt", "fileKey", "fileValue", "ownerId", "themeId") VALUES($1, $2, $3, $4, $5) RETURNING *',
        [createdAt, fileKey, fileValue, ownerId, themeId],
        (error, response) => {
          if (error) {
            return error
          }

          resolve({ themeBackup: response.rows[0] });
        }
      );
    })
  }

  static getThemeBackup(accountId, backupId) {

    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM themeBackup WHERE "ownerId" = $1 AND id = $2',
        [accountId, backupId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ themeBackup: response.rows[0] });
        }
      )
    })
  }

}

module.exports = ThemeBackupTable;