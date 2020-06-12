const pool = require('../../databasePool');

class ThemeBackupTable {
  static storeThemeBackup(themeBackup) {

    const {
      createdAt,
      fileKey,
      fileValue,
      ownerId
    } = themeBackup;

    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO themeBackup("createdAt", "fileKey", "fileValue", "ownerId") VALUES($1, $2, $3, $4) RETURNING *',
        [createdAt, fileKey, fileValue, ownerId],
        (error, response) => {
          if (error) {
            return error
          }

          resolve({ themeBackup: response.rows[0] });
        }
      );
    })
  }
}

module.exports = ThemeBackupTable;