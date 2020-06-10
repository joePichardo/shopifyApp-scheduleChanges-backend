CREATE TABLE gameMember(
    "gameId"      INTEGER,
    "accountId"   INTEGER,
    PRIMARY KEY ("gameId", "accountId"),
    FOREIGN KEY ("gameId") REFERENCES game(id) ON DELETE CASCADE,
    FOREIGN KEY ("accountId") REFERENCES account(id) ON DELETE CASCADE
);