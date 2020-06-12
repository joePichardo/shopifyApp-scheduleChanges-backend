CREATE TABLE themeSchedule(
    id              SERIAL PRIMARY KEY,
    "scheduleAt"    TIMESTAMP NOT NULL,
    "settingsData"  TEXT NOT NULL,
    "ownerId"       INTEGER NOT NULL,
    "backupId"       INTEGER NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES account(id),
    FOREIGN KEY ("backupId") REFERENCES themeBackup(id)
);