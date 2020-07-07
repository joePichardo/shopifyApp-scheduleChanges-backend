CREATE TABLE account(
    id                  SERIAL PRIMARY KEY,
    "storeAddress"      TEXT NOT NULL,
    "accessToken"       TEXT NOT NULL,
    "stagingThemeName"  TEXT DEFAULT '' NOT NULL
);