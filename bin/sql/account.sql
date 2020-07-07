CREATE TABLE account(
    id              SERIAL PRIMARY KEY,
    "storeAddress"  TEXT NOT NULL,
    "accessToken"   TEXT NOT NULL,
    "liveThemeId"     BIGINT NOT NULL,
    "stagingThemeId"  BIGINT NOT NULL,
    FOREIGN KEY ("liveThemeId") REFERENCES theme(id),
    FOREIGN KEY ("stagingThemeId") REFERENCES theme(id)
);