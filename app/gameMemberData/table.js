const pool = require('../../databasePool');

class GameMemberDataTable {
  static storeGameMemberData({ gameId, itemId, accountId, positionId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO gameMemberData("gameId", "itemId", "accountId", "positionId") VALUES($1, $2, $3, $4) RETURNING *',
        [gameId, itemId, accountId, positionId],
        (error, response) => {
          if (error) {
            return error
          }

          resolve({ gameMemberData: response.rows[0] });
        }
      );
    })
  }

  static getGameMemberData({ gameId, accountId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT gv."gameId", gv."itemId", gv."textValue", gv.rating, gmd."positionId"
        FROM gameMemberData AS gmd
        INNER JOIN gameValue AS gv 
        ON gmd."itemId" = gv."itemId" 
        AND gmd."gameId" = gv."gameId"
        WHERE gv."gameId" = $1
        AND gmd."accountId" = $2`,
        [gameId, accountId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ gameMemberData: response.rows });
        }
      )
    })
  }

  static getGameMemberDataAt({ gameId, accountId, positionId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT "itemId" FROM gameMemberData WHERE "gameId" = $1 AND "accountId" = $2 AND "positionId" = $3',
        [gameId, accountId, positionId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ gameMemberData: response.rows[0] });
        }
      )
    })
  }

  static getGameMemberDataItem({ gameId, accountId, itemId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT "positionId" FROM gameMemberData WHERE "gameId" = $1 AND "accountId" = $2 AND "itemId" = $3',
        [gameId, accountId, itemId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve({ gameMemberData: response.rows[0] });
        }
      )
    })
  }

  static deleteGameMemberData({ gameId, accountId, itemId, positionId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM gameMemberData WHERE "gameId" = $1 AND "accountId" = $2 AND "itemId" = $3 AND "positionId" = $4',
        [gameId, accountId, itemId, positionId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve();
        }
      )
    })
  }

  static deleteGameMemberDataAt({ gameId, accountId, positionId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM gameMemberData WHERE "gameId" = $1 AND "accountId" = $2 AND "positionId" = $3',
        [gameId, accountId, positionId],
        (error, response) => {
          if (error) {
            return reject(error);
          }

          resolve();
        }
      )
    })
  }

  static updateGameMemberData({ gameId, itemId, accountId, positionId }) {
    const settingsMap = { positionId };

    const validQueries = Object.entries(settingsMap).filter(([settingKey, settingValue]) => {
      // console.log('settingKey', settingKey, 'settingValue', settingValue);

      if (settingValue !== undefined) {
        return new Promise((resolve, reject) => {
          pool.query(
            `UPDATE gameMemberData SET "${settingKey}" = $1 WHERE "gameId" = $2 AND "itemId" = $3 AND "accountId" = $4`,
            [settingValue, gameId, itemId, accountId],
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

module.exports = GameMemberDataTable;