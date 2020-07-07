CREATE TABLE themeSchedule(
    id              SERIAL PRIMARY KEY,
    "scheduleAt"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "fileKey"       TEXT NOT NULL,
    "fileValue"     TEXT NOT NULL,
    "ownerId"       BIGINT NOT NULL,
    "backupId"      BIGINT NOT NULL,
    description     TEXT NOT NULL,
    deployed        BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("ownerId") REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY ("backupId") REFERENCES themeBackup(id)
);