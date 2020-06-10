const pool = require('../../databasePool');

class AccountGameTable {

  static getAccountGames({ accountId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT *
        FROM game
        WHERE "ownerId" = $1`,
        [accountId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve(response.rows);
        }
      )
    });
  }

}

module.exports = AccountGameTable;