const pool = require('../../databasePool');

class AccountTable {
  static storeAccount({ storeAddress, accessToken, email }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO account("storeAddress", "accessToken", email) 
        VALUES($1, $2, $3)`,
        [storeAddress, accessToken, email],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  }

  static deleteAccount({ storeAddress }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE
        FROM account
        WHERE "storeAddress" = $1`,
        [storeAddress],
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

  static saveAccountStagingThemeName({ storeAddress, stagingThemeName }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE account SET "stagingThemeName" = $1 WHERE "storeAddress" = $2`,
        [stagingThemeName, storeAddress],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ account: response.rows[0] });
        }
      )
    });
  }

  static updateAccessToken({ storeAddress, accessToken, email }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE account SET "accessToken" = $1 , email = $2 WHERE "storeAddress" = $3',
        [accessToken, email, storeAddress],
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