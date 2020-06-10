const { Router } = require('express');
const Game = require('../game/index');
const GameTable = require('../game/table');
const GameMemberTable = require('../gameMember/table');
const GameMemberDataTable = require('../gameMemberData/table');
const GameValueTable = require('../gameValue/table');
const AccountTable = require('../account/table');
const { authenticatedAccount } = require('./helper');
const { getPublicGames, getActiveGames } = require('../game/helper');

const router = new Router();

router.post('/new', (req, res, next) => {
  let accountId, game;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      const { nickname, admissionEndDate, isPublic } = req.body;

      game = new Game({ ownerId: accountId, nickname, admissionEndDate, isPublic });

      return GameTable.storeGame(game);
    })
    .then(() => res.json({ game }))
    .catch(error => next(error));

});

router.put('/update', (req, res, next) => {
  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      const { gameId } = req.body;

      return GameTable.getGame({ gameId });
    })
    .then(game => {

      if (accountId !== game.ownerId) {
        throw new Error("You don't own this game.");
      }

      const { gameId, nickname, admissionEndDate, gameEndDate, isPublic, buyValue } = req.body;

      return GameTable.updateGame({ gameId, nickname, admissionEndDate, isPublic });
    })
    .then(() => res.json({ message: 'successfully updated game' }))
    .catch(error => next(error));
});

router.put('/delete', (req, res, next) => {
  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      const { gameId } = req.body;

      return GameTable.getGame({ gameId });
    })
    .then(game => {

      if (accountId !== game.ownerId) {
        throw new Error("You don't own this game.");
      }

      const { gameId } = req.body;

      return GameTable.deleteGame({ gameId });
    })
    .then(() => res.json({ message: 'successfully deleted game' }))
    .catch(error => next(error));
});

router.get('/public-games', (req, res, next) => {
  getPublicGames()
    .then(({ games }) => res.json({ games }))
    .catch(error => next(error));
});

router.get('/public-games/page/:page', (req, res, next) => {
  const pageNum = req.params.page;

  getPublicGames(pageNum)
    .then(({ games }) => res.json({ games }))
    .catch(error => next(error));
});

router.get('/active-games', (req, res, next) => {
  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      return getActiveGames(accountId);
    })
    .then(({ games }) => res.json({ games }))
    .catch(error => next(error));
});

router.get('/:id/owner', (req, res, next) => {
  const ownerId = req.params.id;

  GameTable.getGameOwner({ ownerId })
    .then(({ username }) => res.json({ username }))
    .catch(error => next(error));
});

router.get('/:id/members', (req, res, next) => {
  const gameId = req.params.id;

  GameMemberTable.getGameMembers({ gameId })
    .then(({ gameMembers }) => res.json({ gameMembers }))
    .catch(error => next(error));
});

router.get('/:id/values', (req, res, next) => {
  const gameId = req.params.id;

  GameValueTable.getGameValues({ gameId })
    .then(({ gameValues }) => res.json({ gameValues }))
    .catch(error => next(error));
});

router.post('/:id/values/add', (req, res, next) => {
  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      const { gameId } = req.body;

      return GameTable.getGame({ gameId });
    })
    .then(game => {

      if (accountId !== game.ownerId) {
        throw new Error("You don't own this game.");
      }

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);

      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      const { gameId, itemId } = req.body;

      return GameValueTable.getGameValue({ gameId, itemId });
    })
    .then(({ gameValue }) => {

      const { itemId } = req.body;

      if (gameValue !== undefined) {
        throw new Error(`Value exists already at position ${itemId}, must update not create.`);
      }

      const { gameId, textValue } = req.body;

      return GameValueTable.storeGameValue({ gameId, itemId, textValue });
    })
    .then(({ gameValue }) => {
      return res.json({
        message: 'successfully added value to game',
        gameValue
      });
    })
    .catch(error => next(error));
});

router.post('/:id/values/update', (req, res, next) => {
  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      const { gameId } = req.body;

      return GameTable.getGame({ gameId });
    })
    .then(game => {

      if (accountId !== game.ownerId) {
        throw new Error("You don't own this game.");
      }

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);

      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      const { gameId, itemId } = req.body;

      return GameValueTable.getGameValue({ gameId, itemId });
    })
    .then(({ gameValue }) => {

      const { gameId, itemId, textValue, rating } = req.body;

      if (gameValue === undefined) {
        throw new Error(`No value exists at position ${itemId} to update.`);
      }

      return GameValueTable.updateGameValue({ gameId, itemId, textValue, rating });
    })
    .then(() => {
      return res.json({
        message: 'successfully updated value for game'
      })
    })
    .catch(error => next(error));
});

router.post('/:id/values/delete', (req, res, next) => {
  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      const { gameId } = req.body;

      return GameTable.getGame({ gameId });
    })
    .then(game => {

      if (accountId !== game.ownerId) {
        throw new Error("You don't own this game.");
      }

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);

      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      const { gameId, itemId } = req.body;

      return GameValueTable.getGameValue({ gameId, itemId });
    })
    .then(({ gameValue }) => {

      const { gameId, itemId } = req.body;

      if (gameValue === undefined) {
        throw new Error(`No value exists at position ${itemId} to delete.`);
      }

      return GameValueTable.deleteGameValue({ gameId, itemId });
    })
    .then(() => {
      return res.json({
        message: 'successfully deleted value for game'
      })
    })
    .catch(error => next(error));
});

router.get('/:id/member/values', (req, res, next) => {
  const gameId = req.params.id;

  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;

      return GameMemberDataTable.getGameMemberData({ gameId, accountId })
    })
    .then(({ gameMemberData }) => res.json({ gameMemberData }))
    .catch(error => next(error));
});

router.post('/:id/member/values/add', (req, res, next) => {
  const gameId = req.params.id;
  const { itemId, positionId } = req.body;

  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account, authenticated }) => {
      if (!authenticated) {
        throw new Error('Unauthenticated');
      }

      accountId = account.id;

      return GameMemberTable.getGameMember({ gameId, accountId });
    })
    .then(({ accountId }) => {

      if (accountId === undefined) {
        throw new Error("You are not a member of the game.");
      }

      return GameTable.getGame({ gameId  });
    })
    .then(game => {

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);
      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      return GameMemberDataTable.getGameMemberDataAt({ gameId, itemId, accountId, positionId });
    })
    .then(({ gameMemberData }) => {

      if (gameMemberData !== undefined) {
        return GameMemberDataTable.deleteGameMemberDataAt({ gameId, accountId, positionId });
      }

      return { gameId, itemId, accountId, positionId };

    })
    .then(() => {
      return GameMemberDataTable.storeGameMemberData({ gameId, itemId, accountId, positionId });
    })
    .then(({ gameMemberData }) => {
      return res.json({
        message: 'successfully added value to game',
        gameMemberData
      });
    })
    .catch(error => next(error));
});

router.post('/:id/member/values/update', (req, res, next) => {
  const gameId = req.params.id;
  const { itemId, positionId } = req.body;

  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account, authenticated }) => {
      if (!authenticated) {
        throw new Error('Unauthenticated');
      }

      accountId = account.id;

      return GameMemberTable.getGameMember({ gameId, accountId });
    })
    .then(({ accountId }) => {

      if (accountId === undefined) {
        throw new Error("You are not a member of the game.");
      }

      return GameTable.getGame({ gameId  });
    })
    .then(game => {

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);
      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      return GameMemberDataTable.getGameMemberDataAt({ gameId, itemId, accountId, positionId });
    })
    .then(({ gameMemberData }) => {

      if (gameMemberData !== undefined) {
        return GameMemberDataTable.deleteGameMemberDataAt({ gameId, accountId, positionId });
      }

      return { gameId, itemId, accountId, positionId };

    })
    .then(() => {

      return GameMemberDataTable.updateGameMemberData({ gameId, itemId, accountId, positionId });
    })
    .then(({ gameMemberData }) => {
      return res.json({
        message: 'successfully updated value to game',
        gameMemberData
      });
    })
    .catch(error => next(error));
});

router.post('/:id/member/values/delete', (req, res, next) => {
  const gameId = req.params.id;
  const { itemId, positionId } = req.body;

  let accountId;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account, authenticated }) => {
      if (!authenticated) {
        throw new Error('Unauthenticated');
      }

      accountId = account.id;

      return GameMemberTable.getGameMember({ gameId, accountId });
    })
    .then(({ accountId }) => {

      if (accountId === undefined) {
        throw new Error("You are not a member of the game.");
      }

      return GameTable.getGame({ gameId  });
    })
    .then(game => {

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);
      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      return GameMemberDataTable.getGameMemberDataAt({ gameId, itemId, accountId, positionId });
    })
    .then(({ gameMemberData }) => {

      if (gameMemberData === undefined) {
        throw new Error(`Value does not exist at position ${positionId}.`);
      }

      return GameMemberDataTable.deleteGameMemberData({ gameId, itemId, accountId, positionId });
    })
    .then(() => {
      return res.json({
        message: 'successfully deleted value to game'
      });
    })
    .catch(error => next(error));
});

router.post('/buy', (req, res, next) => {
  const { gameId, buyValue } = req.body;
  let buyerId;

  GameTable.getGame({ gameId })
    .then(game => {
      if (game.buyValue !== buyValue) {
        throw new Error('Buy value is not correct');
      }

      if (!game.isPublic) {
        throw new Error('Game must be public');
      }

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);
      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      return authenticatedAccount({ sessionString: req.cookies.sessionString });
    })
    .then(({ account, authenticated }) => {
      if (!authenticated) {
        throw new Error('Unauthenticated');
      }

      if (buyValue > account.balance) {
        throw new Error('Buy value exceeds balance');
      }

      buyerId = account.id;

      return GameMemberTable.getGameMember({ gameId, accountId: buyerId });
    })
    .then(({ accountId }) => {
      if (accountId === buyerId) {
        throw new Error('Cannot buy into game again!');
      }

      return Promise.all([
        AccountTable.updateBalance({
          accountId: buyerId,
          value: -buyValue
        }),
        GameTable.updatePotValue({
          gameId: gameId,
          value: buyValue
        }),
        GameMemberTable.storeGameMember({
          gameId,
          accountId: buyerId
        })
      ])
    })
    .then(() => res.json({ message: 'success!' }))
    .catch(error => next(error));
});

router.post('/join', (req, res, next) => {
  const { gameId, buyValue } = req.body;
  let buyerId;

  GameTable.getGame({ gameId })
    .then(game => {

      if (!game.isPublic) {
        throw new Error('Game must be public');
      }

      var nowDate = new Date();
      var gameAdmissionEndDate = new Date(game.admissionEndDate);
      if (nowDate > gameAdmissionEndDate) {
        throw new Error("Game admission date has passed.");
      }

      return authenticatedAccount({ sessionString: req.cookies.sessionString });
    })
    .then(({ account, authenticated }) => {
      if (!authenticated) {
        throw new Error('Unauthenticated');
      }

      buyerId = account.id;

      return GameMemberTable.getGameMember({ gameId, accountId: buyerId });
    })
    .then(({ accountId }) => {
      if (accountId === buyerId) {
        throw new Error('Cannot join into game again!');
      }

      return Promise.all([
        GameMemberTable.storeGameMember({
          gameId,
          accountId: buyerId
        })
      ])
    })
    .then(() => res.json({ message: 'success!' }))
    .catch(error => next(error));
});

router.get('/:id', (req, res, next) => {
  const gameId = req.params.id;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account, authenticated }) => {
      if (!authenticated) {
        throw new Error('Unauthenticated');
      }

      return GameTable.getGame({ gameId });
    })
    .then(game => res.json({ message: 'success', game: game }))
    .catch(error => next(error));
});


module.exports = router;