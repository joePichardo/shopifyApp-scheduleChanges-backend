const pool = require('../../databasePool');
const GameTable = require('./table');

const getPublicGames = (page) => {

  var offset = 0;
  var limit = 2;
  if (page > 1) {
    offset = (page * limit) - limit;
  }

  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT id FROM game WHERE "isPublic" = TRUE ORDER BY birthdate DESC OFFSET $1 LIMIT $2',
      [offset, limit],
      (error, response) => {
        if (error) {
          return reject(error);
        }

        const publicGameRows = response.rows;

        Promise.all(
          publicGameRows.map(
            ({ id }) => {
              return GameTable.getGame({ gameId: id });
            }
          )
        ).then(games => resolve({ games }))
          .catch(error => reject(error));
      }
    )
  });
};

const getActiveGames = (accountId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT "gameId" FROM gameMember WHERE "accountId" = $1',
      [accountId],
      (error, response) => {
        if (error) {
          return reject(error);
        }

        const activeGameRows = response.rows;

        Promise.all(
          activeGameRows.map(
            ({ gameId }) => {
              return GameTable.getGame({ gameId: gameId });
            }
          )
        ).then(games => resolve({ games }))
          .catch(error => reject(error));
      }
    )
  });
};

module.exports = { getPublicGames, getActiveGames };