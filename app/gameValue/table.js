const pool = require('../../databasePool');

class GameValueTable {
  static storeGameValue(gameValue) {
    const { gameId, itemId, textValue } = gameValue;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO gameValue("gameId", "itemId", "textValue") 
        VALUES($1, $2, $3) RETURNING *`,
        [gameId, itemId, textValue],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ gameValue: response.rows[0] });
        }
      )
    });
  }

  static getGameValue({ gameId, itemId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT "textValue"
        FROM gameValue
        WHERE "gameId" = $1 AND "itemId" = $2`,
        [gameId, itemId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ gameValue: response.rows[0] });
        }
      )
    });
  }

  static deleteGameValue({ gameId, itemId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM gameValue
        WHERE "gameId" = $1 AND "itemId" = $2`,
        [gameId, itemId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve();
        }
      )
    });
  }

  static getGameValues({ gameId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT *
        FROM gameValue
        WHERE "gameId" = $1
        ORDER BY "itemId" ASC`,
        [gameId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ gameValues: response.rows });
        }
      )
    });
  }

  static updateGameValue({ gameId, itemId, textValue, rating }) {

    const settingsMap = { textValue, rating };

    const validQueries = Object.entries(settingsMap).filter(([settingKey, settingValue]) => {
      // console.log('settingKey', settingKey, 'settingValue', settingValue);

      if (settingValue !== undefined) {
        return new Promise((resolve, reject) => {
          pool.query(
            `UPDATE gameValue SET "${settingKey}" = $1 WHERE "gameId" = $2 AND "itemId" = $3 RETURNING *`,
            [settingValue, gameId, itemId],
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

module.exports = GameValueTable;