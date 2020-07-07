CREATE TABLE themeBackup(
    id                      SERIAL PRIMARY KEY,
    "createdAt"             TIMESTAMP WITH TIME ZONE NOT NULL,
    "fileKey"               TEXT NOT NULL,
    "fileValue"             TEXT NOT NULL,
    "ownerId"               BIGINT NOT NULL,
    "themeId"               BIGINT NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY ("themeId") REFERENCES theme(id),
);