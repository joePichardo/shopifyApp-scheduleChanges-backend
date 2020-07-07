CREATE TABLE theme(
    id              SERIAL PRIMARY KEY,
    "ownerId"       BIGINT NOT NULL,
    "themeId"       BIGINT NOT NULL,
    name            TEXT NOT NULL,
    "themeStatus"   INT NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY ("themeStatus") REFERENCES themeStatus(id),
    UNIQUE ("ownerId", "themeId")
);