const pool = require('../../databasePool');

class AccountTable {
  static storeAccount({ storeAddress, accessToken }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO account("storeAddress", "accessToken") 
        VALUES($1, $2)`,
        [storeAddress, accessToken],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  }

  static getAccount({ storeAddress }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM account 
        WHERE "storeAddress" = $1`,
        [storeAddress],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ account: response.rows[0] });
        }
      )
    });
  }

  static updateAccessToken({ storeAddress, accessToken }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE account SET "accessToken" = $1 WHERE "storeAddress" = $2',
        [accessToken, storeAddress],
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

module.exports = AccountTable;