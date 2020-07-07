CREATE TABLE theme(
    id              SERIAL PRIMARY KEY,
    "ownerId"       BIGINT NOT NULL,
    "themeId"       BIGINT NOT NULL,
    name            TEXT NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES account(id) ON DELETE CASCADE,
    unique ("ownerId", "themeId")
);