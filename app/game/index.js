
const DEFAULT_PROPERTIES = {
  gameId: undefined,
  nickname: 'unnamed',
  isPublic: false,
  buyValue: 0,
  potValue: 0,
  ownerId: undefined,
  get birthdate() {
    return new Date()
  },
  get admissionEndDate() {
    var date = new Date();
    date.setDate(date.getDate() + 10);

    return date;
  },
  get gameEndDate() {
    var date = new Date();
    date.setDate(date.getDate() + 15);

    return date;
  }
};

class Game {
  constructor({
                gameId,
                birthdate,
                admissionEndDate,
                gameEndDate,
                nickname,
                isPublic,
                buyValue,
                potValue,
                ownerId
              } = {}) {
    this.gameId = gameId || DEFAULT_PROPERTIES.gameId;
    this.birthdate = birthdate || DEFAULT_PROPERTIES.birthdate;
    this.admissionEndDate = admissionEndDate || DEFAULT_PROPERTIES.admissionEndDate;
    this.gameEndDate = gameEndDate || DEFAULT_PROPERTIES.gameEndDate;
    this.nickname = nickname || DEFAULT_PROPERTIES.nickname;
    this.isPublic = isPublic || DEFAULT_PROPERTIES.isPublic;
    this.buyValue = buyValue || DEFAULT_PROPERTIES.buyValue;
    this.potValue = potValue || DEFAULT_PROPERTIES.potValue;
    this.ownerId = ownerId || DEFAULT_PROPERTIES.ownerId;
  }
}

module.exports = Game;