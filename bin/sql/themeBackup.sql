CREATE TABLE themeBackup(
    id                      SERIAL PRIMARY KEY,
    "createdAt"             TIMESTAMP WITH TIME ZONE NOT NULL,
    "fileKey"               TEXT NOT NULL,
    "fileValue"             TEXT NOT NULL,
    "ownerId"               INTEGER NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES account(id)
);