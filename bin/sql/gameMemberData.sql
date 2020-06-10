CREATE TABLE gameMemberData(
    "gameId"      INTEGER NOT NULL,
    "itemId"     INTEGER NOT NULL,
    "accountId"   INTEGER NOT NULL,
    "positionId"  INTEGER NOT NULL,
    PRIMARY KEY ("gameId", "itemId", "accountId"),
    FOREIGN KEY ("gameId", "itemId") REFERENCES gameValue("gameId", "itemId") ON DELETE CASCADE
);
